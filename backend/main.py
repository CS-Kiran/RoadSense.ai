from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func, text
from datetime import timedelta
import schemas
import models
import auth
from database import engine, get_db, Base
import os
import shutil
from typing import Optional
from auth import get_current_user
from typing import List, Optional
from fastapi import UploadFile, Query
import uuid
import mimetypes
from pathlib import Path
from math import radians, cos, sin, asin, sqrt
from datetime import datetime, timedelta
from typing import Dict
from sqlalchemy import text


# print("🗑️  Dropping all tables...")
# Base.metadata.drop_all(bind=engine)

print("🔨 Creating all tables from models...")
Base.metadata.create_all(bind=engine)

print("✅ Database setup complete!")

app = FastAPI(title="RoadSense.ai API", version="1.0.0")

origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

UPLOAD_DIR = "uploads/government_ids"
os.makedirs(UPLOAD_DIR, exist_ok=True)

REPORT_IMAGES_DIR = "uploads/report_images"
os.makedirs(REPORT_IMAGES_DIR, exist_ok=True)

ALLOWED_IMAGE_EXTENSIONS = {'jpg', 'jpeg', 'png', 'webp'}
MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10MB
MAX_IMAGES_PER_REPORT = 5

@app.get("/")
def read_root():
    return {"message": "RoadSense.ai API is running", "version": "1.0.0"}

@app.get("/api/health")
def health_check(db: Session = Depends(get_db)):
    """Health check endpoint"""
    try:
        db.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

@app.post("/api/register/citizen", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register_citizen(user_data: schemas.CitizenRegister, db: Session = Depends(get_db)):
    """Register a new citizen"""
    existing_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    new_user = models.User(
        full_name=user_data.full_name,
        email=user_data.email,
        password_hash=auth.get_password_hash(user_data.password),
        role=models.UserRole.CITIZEN,
        account_status=models.AccountStatus.ACTIVE,
        is_active=True
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

@app.post("/api/register/official", status_code=status.HTTP_201_CREATED)
async def register_official(
    full_name: str = Form(...),
    email: str = Form(...),
    phone_number: str = Form(...),
    employee_id: str = Form(...),
    department: str = Form(...),
    designation: str = Form(...),
    zone: str = Form(...),
    password: str = Form(...),
    government_id: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    """Register a new government official"""    
    existing_user = db.query(models.User).filter(models.User.email == email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered in users table"
        )
    
    existing_official = db.query(models.Official).filter(models.Official.email == email).first()
    if existing_official:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered as official"
        )
    
    existing_employee = db.query(models.Official).filter(
        models.Official.employee_id == employee_id
    ).first()
    if existing_employee:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Employee ID already registered"
        )
    
    file_path = None
    if government_id:
        allowed_extensions = ['pdf', 'jpg', 'jpeg', 'png']
        file_extension = government_id.filename.split(".")[-1].lower()
        
        if file_extension not in allowed_extensions:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid file type. Allowed: {', '.join(allowed_extensions)}"
            )
        
        government_id.file.seek(0, 2)  
        file_size = government_id.file.tell() 
        government_id.file.seek(0)  
        
        if file_size > 5 * 1024 * 1024:  # 5MB
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File size exceeds 5MB limit"
            )
        
        safe_filename = f"{employee_id}_{full_name.replace(' ', '_')}.{file_extension}"
        file_path = f"{UPLOAD_DIR}/{safe_filename}"
        
        try:
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(government_id.file, buffer)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"File upload failed: {str(e)}"
            )
    
    try:
        password_hash = auth.get_password_hash(password)
    except Exception as e:
        if file_path and os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Password hashing failed: {str(e)}"
        )
    
    new_official = models.Official(
        user_id=0, 
        full_name=full_name,
        email=email,
        phone_number=phone_number,
        password_hash=password_hash,
        employee_id=employee_id,
        department=department,
        designation=designation,
        zone=zone,
        government_id_url=file_path,
        role=models.UserRole.OFFICIAL,
        account_status=models.AccountStatus.PENDING,
        is_active=False
    )
    
    try:
        db.add(new_official)
        db.commit()
        db.refresh(new_official)
        
        return {
            "message": "Registration successful. Your account is pending approval.",
            "id": new_official.id,
            "full_name": new_official.full_name,
            "email": new_official.email,
            "employee_id": new_official.employee_id,
            "role": new_official.role.value,
            "account_status": new_official.account_status.value
        }
        
    except Exception as e:
        db.rollback()
        if file_path and os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@app.post("/api/login", response_model=schemas.Token)
def login(login_data: schemas.LoginRequest, db: Session = Depends(get_db)):
    """Unified login endpoint - detects user type by email domain"""
    user = auth.authenticate_user(db, login_data.email, login_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check account status
    if user.account_status == models.AccountStatus.BLOCKED:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account has been blocked. Please contact support."
        )
    
    if user.account_status == models.AccountStatus.SUSPENDED:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is suspended. Please contact support."
        )
    
    if user.role == models.UserRole.OFFICIAL and user.account_status == models.AccountStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account is pending approval. Please wait for admin verification."
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email, "role": user.role.value},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role.value,
        "account_status": user.account_status.value
    }

@app.get("/api/users/me", response_model=schemas.UserResponse)
async def get_current_user_info(current_user = Depends(auth.get_current_user)):
    """Get current authenticated user information"""
    return current_user

@app.get("/api/profile")
async def get_profile(current_user = Depends(get_current_user)):
    """Get current user profile"""
    return {
        "id": current_user.id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "role": current_user.role.value,
        "account_status": current_user.account_status.value,
        "created_at": current_user.created_at
    }

@app.get("/api/protected")
async def protected_route(current_user = Depends(auth.get_current_user)):
    """Example protected route"""
    return {
        "message": f"Hello {current_user.full_name}!",
        "role": current_user.role.value,
        "status": current_user.account_status.value
    }


def validate_image(file: UploadFile) -> tuple[bool, str]:
    """Validate image file"""
    # Check file extension
    file_extension = file.filename.split(".")[-1].lower()
    if file_extension not in ALLOWED_IMAGE_EXTENSIONS:
        return False, f"Invalid file type. Allowed: {', '.join(ALLOWED_IMAGE_EXTENSIONS)}"
    
    # Check file size
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    
    if file_size > MAX_IMAGE_SIZE:
        return False, f"File size exceeds {MAX_IMAGE_SIZE / (1024*1024)}MB limit"
    
    return True, "Valid"

# Helper function to save image
def save_report_image(file: UploadFile, report_id: int, order: int) -> tuple[str, str, int]:
    """Save report image and return filename, filepath, and size"""
    file_extension = file.filename.split(".")[-1].lower()
    unique_filename = f"report_{report_id}_{order}_{uuid.uuid4().hex}.{file_extension}"
    file_path = os.path.join(REPORT_IMAGES_DIR, unique_filename)
    
    # Save file
    file.file.seek(0)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    file_size = os.path.getsize(file_path)
    mime_type = mimetypes.guess_type(file_path)[0] or 'image/jpeg'
    
    return unique_filename, file_path, file_size, mime_type

# 1. CREATE REPORT WITH IMAGES
@app.post("/api/reports", response_model=schemas.ReportResponse, status_code=status.HTTP_201_CREATED)
async def create_report(
    latitude: float = Form(...),
    longitude: float = Form(...),
    address: str = Form(...),
    issue_type: str = Form(...),
    title: str = Form(...),
    description: str = Form(...),
    is_anonymous: bool = Form(False),
    images: List[UploadFile] = File(default=[]),
    current_user = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new report with optional images (max 5)"""
    
    # Validate number of images
    if len(images) > MAX_IMAGES_PER_REPORT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Maximum {MAX_IMAGES_PER_REPORT} images allowed per report"
        )
    
    # Validate each image
    for idx, image in enumerate(images):
        is_valid, message = validate_image(image)
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Image {idx + 1}: {message}"
            )
    
    # Create report
    new_report = models.Report(
        user_id=current_user.id,
        latitude=latitude,
        longitude=longitude,
        address=address,
        issue_type=models.IssueType(issue_type),
        title=title,
        description=description,
        is_anonymous=is_anonymous,
        status=models.ReportStatus.PENDING,
        priority=models.ReportPriority.MEDIUM
    )
    
    try:
        db.add(new_report)
        db.commit()
        db.refresh(new_report)
        
        # Save images if provided
        saved_images = []
        for idx, image in enumerate(images):
            try:
                filename, filepath, file_size, mime_type = save_report_image(image, new_report.id, idx)
                
                report_image = models.ReportImage(
                    report_id=new_report.id,
                    filename=filename,
                    file_path=filepath,
                    file_size=file_size,
                    mime_type=mime_type,
                    display_order=idx
                )
                
                db.add(report_image)
                saved_images.append(filepath)
                
            except Exception as e:
                # Rollback and cleanup uploaded files
                db.rollback()
                for saved_file in saved_images:
                    if os.path.exists(saved_file):
                        os.remove(saved_file)
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Error saving image {idx + 1}: {str(e)}"
                )
        
        db.commit()
        db.refresh(new_report)
        
        # Create initial status history
        status_history = models.ReportStatusHistory(
            report_id=new_report.id,
            old_status=None,
            new_status=models.ReportStatus.PENDING,
            changed_by=current_user.id,
            changed_by_role=current_user.role,
            comment="Report created"
        )
        db.add(status_history)
        db.commit()
        
        return new_report
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating report: {str(e)}"
        )

# 2. GET ALL REPORTS (with filters)
@app.get("/api/reports", response_model=List[schemas.ReportListResponse])
async def get_reports(
    status_filter: Optional[str] = Query(None),
    issue_type: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get all reports with optional filters"""
    
    query = db.query(models.Report)
    
    # Apply filters
    if status_filter:
        query = query.filter(models.Report.status == models.ReportStatus(status_filter))
    
    if issue_type:
        query = query.filter(models.Report.issue_type == models.IssueType(issue_type))
    
    if priority:
        query = query.filter(models.Report.priority == models.ReportPriority(priority))
    
    # Officials see all reports in their zone
    if current_user.role == models.UserRole.OFFICIAL:
        official = db.query(models.Official).filter(models.Official.email == current_user.email).first()
        if official:
            query = query.filter(models.Report.assigned_zone == official.zone)
    
    # Order by creation date (newest first)
    query = query.order_by(models.Report.created_at.desc())
    
    reports = query.offset(skip).limit(limit).all()
    
    # Add image count to each report
    result = []
    for report in reports:
        report_dict = {
            "id": report.id,
            "user_id": report.user_id,
            "latitude": report.latitude,
            "longitude": report.longitude,
            "address": report.address,
            "issue_type": report.issue_type.value,
            "title": report.title,
            "status": report.status.value,
            "priority": report.priority.value,
            "created_at": report.created_at,
            "image_count": len(report.images)
        }
        result.append(report_dict)
    
    return result

# 3. GET USER'S REPORTS
@app.get("/api/reports/my-reports", response_model=List[schemas.ReportResponse])
async def get_my_reports(
    current_user = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get all reports created by logged-in user"""
    
    reports = db.query(models.Report).filter(
        models.Report.user_id == current_user.id
    ).order_by(models.Report.created_at.desc()).all()
    
    return reports

# 4. GET SINGLE REPORT BY ID
@app.get("/api/reports/{report_id}", response_model=schemas.ReportResponse)
async def get_report(
    report_id: int,
    current_user = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get single report by ID with all details"""
    
    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    # Increment view count
    report.views += 1
    db.commit()
    
    return report

# 5. UPDATE REPORT STATUS (Officials only)
@app.patch("/api/reports/{report_id}/status")
async def update_report_status(
    report_id: int,
    status_update: schemas.ReportStatusUpdate,
    current_user = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Update report status (Officials/Admin only)"""
    
    # Check permission
    if current_user.role not in [models.UserRole.OFFICIAL, models.UserRole.ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only officials can update report status"
        )
    
    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    # Store old status
    old_status = report.status
    
    # Update status
    report.status = models.ReportStatus(status_update.status.value)
    
    if status_update.priority:
        report.priority = models.ReportPriority(status_update.priority.value)
    
    # Update timestamps
    if status_update.status == schemas.ReportStatusEnum.RESOLVED:
        report.resolved_at = func.now()
    elif status_update.status == schemas.ReportStatusEnum.CLOSED:
        report.closed_at = func.now()
    
    # Create status history entry
    status_history = models.ReportStatusHistory(
        report_id=report_id,
        old_status=old_status,
        new_status=report.status,
        changed_by=current_user.id,
        changed_by_role=current_user.role,
        comment=status_update.comment
    )
    
    db.add(status_history)
    db.commit()
    db.refresh(report)
    
    return {
        "message": "Report status updated successfully",
        "report_id": report_id,
        "old_status": old_status.value,
        "new_status": report.status.value
    }

# 6. ASSIGN REPORT TO OFFICIAL
@app.patch("/api/reports/{report_id}/assign")
async def assign_report(
    report_id: int,
    assignment: schemas.ReportAssignment,
    current_user = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Assign report to official (Admin only)"""
    
    if current_user.role != models.UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can assign reports"
        )
    
    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    official = db.query(models.Official).filter(models.Official.id == assignment.official_id).first()
    
    if not official:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Official not found"
        )
    
    report.assigned_to = official.id
    report.assigned_zone = official.zone
    report.status = models.ReportStatus.UNDER_REVIEW
    
    # Create status history
    status_history = models.ReportStatusHistory(
        report_id=report_id,
        old_status=report.status,
        new_status=models.ReportStatus.UNDER_REVIEW,
        changed_by=current_user.id,
        changed_by_role=current_user.role,
        comment=f"Assigned to {official.full_name}. {assignment.comment or ''}"
    )
    
    db.add(status_history)
    db.commit()
    
    return {
        "message": "Report assigned successfully",
        "report_id": report_id,
        "assigned_to": official.full_name,
        "zone": official.zone
    }

# 7. CLOSE REPORT (User or Official)
@app.patch("/api/reports/{report_id}/close")
async def close_report(
    report_id: int,
    comment: Optional[str] = None,
    current_user = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Close report (Owner or Officials)"""
    
    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    # Check permission
    if report.user_id != current_user.id and current_user.role not in [models.UserRole.OFFICIAL, models.UserRole.ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to close this report"
        )
    
    old_status = report.status
    report.status = models.ReportStatus.CLOSED
    report.closed_at = func.now()
    
    # Create status history
    status_history = models.ReportStatusHistory(
        report_id=report_id,
        old_status=old_status,
        new_status=models.ReportStatus.CLOSED,
        changed_by=current_user.id,
        changed_by_role=current_user.role,
        comment=comment or "Report closed"
    )
    
    db.add(status_history)
    db.commit()
    
    return {
        "message": "Report closed successfully",
        "report_id": report_id
    }

@app.delete("/api/reports/{report_id}")
async def delete_report(
    report_id: int,
    current_user = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Delete report (Owner within 24 hours or Admin)"""
    
    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    # Check permission
    from datetime import datetime, timedelta
    is_owner = report.user_id == current_user.id
    is_within_24h = (datetime.now(report.created_at.tzinfo) - report.created_at) < timedelta(hours=24)
    is_admin = current_user.role == models.UserRole.ADMIN
    
    if not ((is_owner and is_within_24h) or is_admin):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this report (only within 24 hours of creation)"
        )
    
    # Delete associated images from filesystem
    for image in report.images:
        if os.path.exists(image.file_path):
            os.remove(image.file_path)
    
    # Delete report (cascade will handle related records)
    db.delete(report)
    db.commit()
    
    return {"message": "Report deleted successfully", "report_id": report_id}

@app.get("/api/reports/{report_id}/history", response_model=List[schemas.StatusHistoryResponse])
async def get_report_history(
    report_id: int,
    current_user = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get status history for a report"""
    
    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    history = db.query(models.ReportStatusHistory).filter(
        models.ReportStatusHistory.report_id == report_id
    ).order_by(models.ReportStatusHistory.created_at.desc()).all()
    
    return history

@app.get("/api/reports/images/{filename}")
async def get_report_image(
    filename: str,
):
    """Serve report image file"""
    from fastapi.responses import FileResponse
    
    file_path = os.path.join(REPORT_IMAGES_DIR, filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found"
        )
    
    return FileResponse(file_path)

# 11. GET REPORT STATISTICS (for officials/admin)
@app.get("/api/reports/stats/summary")
async def get_report_statistics(
    current_user = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get report statistics"""
    
    if current_user.role == models.UserRole.CITIZEN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only officials can view statistics"
        )
    
    from sqlalchemy import func
    
    # Total reports
    total_reports = db.query(func.count(models.Report.id)).scalar()
    
    # Reports by status
    status_counts = db.query(
        models.Report.status,
        func.count(models.Report.id)
    ).group_by(models.Report.status).all()
    
    # Reports by issue type
    issue_counts = db.query(
        models.Report.issue_type,
        func.count(models.Report.id)
    ).group_by(models.Report.issue_type).all()
    
    return {
        "total_reports": total_reports,
        "by_status": {status.value: count for status, count in status_counts},
        "by_issue_type": {issue.value: count for issue, count in issue_counts}
    }

@app.get("/api/reports/nearby")
async def get_nearby_reports(
    latitude: float = Query(..., description="User's current latitude"),
    longitude: float = Query(..., description="User's current longitude"),
    radius_km: float = Query(10, ge=0.1, le=100, description="Search radius in kilometers"),
    db: Session = Depends(get_db)
):
    """
    Get nearby reports for heatmap visualization.
    Calculates severity based on report density in areas.
    Public endpoint - no authentication required for map viewing.
    """
    
    # Haversine formula to calculate distance between two points
    def haversine(lon1, lat1, lon2, lat2):
        """Calculate distance in kilometers between two lat/lon points"""
        lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
        dlon = lon2 - lon1
        dlat = lat2 - lat1
        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        c = 2 * asin(sqrt(a))
        km = 6371 * c  # Earth's radius in kilometers
        return km
    
    # Get all reports from database
    all_reports = db.query(models.Report).all()
    
    # Filter reports within radius and prepare response
    nearby_reports = []
    for report in all_reports:
        distance = haversine(longitude, latitude, report.longitude, report.latitude)
        
        if distance <= radius_km:
            # Get first image if available
            first_image = None
            if report.images and len(report.images) > 0:
                first_image = f"/api/reports/images/{report.images[0].filename}"
            
            nearby_reports.append({
                "id": report.id,
                "latitude": report.latitude,
                "longitude": report.longitude,
                "address": report.address,
                "issue_type": report.issue_type.value,
                "title": report.title,
                "description": report.description,
                "status": report.status.value,
                "priority": report.priority.value,
                "created_at": report.created_at.isoformat(),
                "upvotes": report.upvotes,
                "distance_km": round(distance, 2),
                "image_url": first_image
            })
    
    # Calculate density-based severity
    # Group reports by proximity (within 500m = 0.5km) to determine hotspots
    def calculate_area_severity(reports_list):
        """
        Calculate severity based on report density.
        More reports in a small area = higher severity.
        """
        result = []
        processed = set()
        
        for i, report in enumerate(reports_list):
            if i in processed:
                continue
            
            # Find nearby reports within 500m to form a cluster
            cluster = [report]
            cluster_indices = {i}
            
            for j, other_report in enumerate(reports_list):
                if j != i and j not in processed:
                    dist = haversine(
                        report['longitude'], report['latitude'],
                        other_report['longitude'], other_report['latitude']
                    )
                    if dist <= 0.5:  # 500m radius for clustering
                        cluster.append(other_report)
                        cluster_indices.add(j)
            
            # Determine severity based on cluster size
            cluster_size = len(cluster)
            if cluster_size >= 5:
                severity = "critical"
            elif cluster_size >= 3:
                severity = "high"
            elif cluster_size >= 2:
                severity = "medium"
            else:
                severity = "low"
            
            # Add severity and cluster info to all reports in cluster
            for report_item in cluster:
                report_item['severity'] = severity
                report_item['cluster_count'] = cluster_size
            
            result.extend(cluster)
            processed.update(cluster_indices)
        
        return result
    
    # Apply severity calculation
    reports_with_severity = calculate_area_severity(nearby_reports)
    
    # Calculate statistics
    status_counts = {}
    severity_counts = {}
    issue_type_counts = {}
    
    for report in reports_with_severity:
        status = report['status']
        severity = report['severity']
        issue_type = report['issue_type']
        
        status_counts[status] = status_counts.get(status, 0) + 1
        severity_counts[severity] = severity_counts.get(severity, 0) + 1
        issue_type_counts[issue_type] = issue_type_counts.get(issue_type, 0) + 1
    
    return {
        "success": True,
        "user_location": {
            "latitude": latitude,
            "longitude": longitude
        },
        "radius_km": radius_km,
        "total_reports": len(reports_with_severity),
        "reports": reports_with_severity,
        "statistics": {
            "by_status": status_counts,
            "by_severity": severity_counts,
            "by_issue_type": issue_type_counts
        }
    }
    
@app.get("/api/citizens/dashboard/stats")
async def get_citizen_dashboard_stats(
    current_user = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get citizen dashboard statistics - Fixed version"""
    try:
        # Check user role
        user_role = current_user.role.value if hasattr(current_user.role, 'value') else current_user.role
        if user_role != 'citizen':
            return {
                "total": 0,
                "pending": 0,
                "in_progress": 0,
                "resolved": 0,
                "weekly_change": 0,
                "avg_response_time": "24h"
            }
        
        # Get user's reports
        user_reports = db.query(models.Report).filter(
            models.Report.user_id == current_user.id
        ).all()
        
        # Calculate basic stats
        total = len(user_reports)
        pending = 0
        in_progress = 0
        resolved = 0
        
        for report in user_reports:
            status = report.status.value if hasattr(report.status, 'value') else str(report.status)
            if status.lower() == 'pending':
                pending += 1
            elif status.lower() in ['in_progress', 'in progress', 'acknowledged']:
                in_progress += 1
            elif status.lower() in ['resolved', 'closed']:
                resolved += 1
        
        # Calculate weekly change
        now = datetime.utcnow()
        last_week = now - timedelta(days=7)
        prev_week = now - timedelta(days=14)
        
        this_week_count = 0
        prev_week_count = 0
        
        for report in user_reports:
            if report.created_at:
                if report.created_at >= last_week:
                    this_week_count += 1
                elif prev_week <= report.created_at < last_week:
                    prev_week_count += 1
        
        if prev_week_count > 0:
            weekly_change = round(((this_week_count - prev_week_count) / prev_week_count) * 100, 1)
        else:
            weekly_change = 100 if this_week_count > 0 else 0
        
        # Calculate average response time
        response_times = []
        for report in user_reports:
            status = report.status.value if hasattr(report.status, 'value') else str(report.status)
            if status.lower() in ['resolved', 'closed']:
                # Try different timestamp fields
                resolved_time = None
                if hasattr(report, 'resolved_at') and report.resolved_at:
                    resolved_time = report.resolved_at
                elif hasattr(report, 'updated_at') and report.updated_at:
                    resolved_time = report.updated_at
                
                if resolved_time and report.created_at:
                    time_diff = (resolved_time - report.created_at).total_seconds()
                    response_times.append(time_diff)
        
        if response_times:
            avg_seconds = sum(response_times) / len(response_times)
            avg_hours = int(avg_seconds / 3600)
            if avg_hours < 1:
                avg_response_time = "< 1h"
            elif avg_hours < 24:
                avg_response_time = f"{avg_hours}h"
            else:
                avg_days = int(avg_hours / 24)
                avg_response_time = f"{avg_days}d"
        else:
            avg_response_time = "24h"
        
        return {
            "total": total,
            "pending": pending,
            "in_progress": in_progress,
            "resolved": resolved,
            "weekly_change": weekly_change,
            "avg_response_time": avg_response_time
        }
        
    except Exception as e:
        import traceback
        print(f"❌ Error in dashboard stats: {str(e)}")
        print(traceback.format_exc())
        
        # Return default values instead of error
        return {
            "total": 0,
            "pending": 0,
            "in_progress": 0,
            "resolved": 0,
            "weekly_change": 0,
            "avg_response_time": "24h"
        }


@app.get("/api/citizens/dashboard/recent-reports")
async def get_recent_reports(
    limit: int = Query(5, ge=1, le=20),
    current_user = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's recent reports for dashboard - Fixed version"""
    try:
        # Check user role
        user_role = current_user.role.value if hasattr(current_user.role, 'value') else current_user.role
        if user_role != 'citizen':
            return []
        
        # Get reports
        reports = db.query(models.Report).filter(
            models.Report.user_id == current_user.id
        ).order_by(models.Report.created_at.desc()).limit(limit).all()
        
        # Format response
        result = []
        for report in reports:
            try:
                # Safely get enum values
                status = report.status.value if hasattr(report.status, 'value') else str(report.status)
                priority = report.priority.value if hasattr(report.priority, 'value') else str(report.priority)
                issue_type = report.issue_type.value if hasattr(report.issue_type, 'value') else str(report.issue_type)
                
                # Count images safely
                image_count = 0
                if report.images:
                    try:
                        if isinstance(report.images, str):
                            import json
                            images = json.loads(report.images)
                            image_count = len(images) if isinstance(images, list) else 0
                        elif isinstance(report.images, list):
                            image_count = len(report.images)
                    except:
                        image_count = 0
                
                # Format created_at
                created_at = report.created_at.isoformat() if report.created_at else datetime.utcnow().isoformat()
                
                result.append({
                    "id": report.id,
                    "title": report.title or "Untitled",
                    "issue_type": issue_type,
                    "status": status,
                    "priority": priority,
                    "address": report.address or "Unknown location",
                    "created_at": created_at,
                    "upvotes": report.upvotes or 0,
                    "image_count": image_count
                })
            except Exception as e:
                print(f"Error processing report {report.id}: {str(e)}")
                continue
        
        return result
        
    except Exception as e:
        import traceback
        print(f"❌ Error in recent reports: {str(e)}")
        print(traceback.format_exc())
        return []
    

@app.get("/api/users/me/profile")
async def get_user_profile(
    current_user = Depends(auth.get_current_user)
):
    """Get current user profile"""
    return {
        "id": current_user.id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "phone_number": getattr(current_user, 'phone_number', None),
        "profile_image_url": getattr(current_user, 'profile_image_url', None),
        "role": current_user.role.value,
        "account_status": current_user.account_status.value,
        "created_at": current_user.created_at.isoformat()
    }


@app.patch("/api/users/me/profile")
async def update_user_profile(
    profile_data: Dict,
    current_user = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile"""
    # Update allowed fields
    if "full_name" in profile_data:
        current_user.full_name = profile_data["full_name"]
    
    if "phone_number" in profile_data:
        current_user.phone_number = profile_data.get("phone_number")
    
    if "profile_image_url" in profile_data:
        current_user.profile_image_url = profile_data.get("profile_image_url")
    
    db.commit()
    db.refresh(current_user)
    
    return {
        "message": "Profile updated successfully",
        "data": {
            "id": current_user.id,
            "full_name": current_user.full_name,
            "email": current_user.email,
            "phone_number": getattr(current_user, 'phone_number', None),
            "profile_image_url": getattr(current_user, 'profile_image_url', None)
        }
    }


@app.post("/api/users/change-password")
async def change_password(
    password_data: Dict,
    current_user = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Change user password"""
    current_password = password_data.get("currentPassword")
    new_password = password_data.get("newPassword")
    
    if not current_password or not new_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Both current and new passwords are required"
        )
    
    # Verify current password
    if not auth.verify_password(current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Update password
    current_user.password_hash = auth.get_password_hash(new_password)
    db.commit()
    
    return {"message": "Password changed successfully"}


@app.patch("/api/users/notification-preferences")
async def update_notification_preferences(
    preferences: Dict,
    current_user = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Update user notification preferences"""
    # In a real app, you'd store these in a user_preferences table
    # For now, just return success
    return {"message": "Notification preferences updated successfully"}


PROFILE_IMAGES_DIR = "uploads/profile_images"
os.makedirs(PROFILE_IMAGES_DIR, exist_ok=True)

@app.post("/api/upload/profile-image")
async def upload_profile_image(
    image: UploadFile = File(...),
    current_user = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Upload profile image"""
    # Validate image
    is_valid, message = validate_image(image)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )
    
    # Generate unique filename
    file_extension = image.filename.split(".")[-1].lower()
    unique_filename = f"profile_{current_user.id}_{uuid.uuid4().hex}.{file_extension}"
    file_path = os.path.join(PROFILE_IMAGES_DIR, unique_filename)
    
    # Save file
    try:
        image.file.seek(0)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        
        # Generate URL (adjust based on your server setup)
        image_url = f"/api/uploads/profile-images/{unique_filename}"
        
        return {
            "message": "Image uploaded successfully",
            "data": {
                "url": image_url,
                "filename": unique_filename
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error uploading image: {str(e)}"
        )


@app.get("/api/uploads/profile-images/{filename}")
async def get_profile_image(filename: str):
    """Serve profile image file"""
    from fastapi.responses import FileResponse
    file_path = os.path.join(PROFILE_IMAGES_DIR, filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found"
        )
    
    return FileResponse(file_path)

@app.post("/api/admin/login")
async def admin_login(
    login_data: dict,
    db: Session = Depends(get_db)
):
    """
    Simple admin login - checks credentials against admin table
    No JWT tokens, just plain validation
    """
    try:
        username = login_data.get("username")
        password = login_data.get("password")
        
        if not username or not password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username and password are required"
            )
        
        # Query admin table directly
        result = db.execute(
            text("SELECT id, username, created_at FROM admin WHERE username = :username AND password = :password LIMIT 1"),
            {"username": username, "password": password}
        )
        admin_row = result.fetchone()
        
        if admin_row:
            # Successful login
            return {
                "success": True,
                "message": "Login successful",
                "role": "admin",
                "user": {
                    "id": admin_row.id,
                    "username": admin_row.username,
                    "full_name": "Administrator",
                    "email": f"{admin_row.username}@roadsense.ai",
                    "role": "admin",
                    "created_at": str(admin_row.created_at)
                }
            }
        
        # Invalid credentials
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Admin login error: {str(e)}")
        import traceback
        print(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed. Please try again."
        )


# Logout endpoint (optional - just clears session on frontend)
@app.post("/api/admin/logout")
async def admin_logout():
    """Admin logout - no server-side session to clear"""
    return {"success": True, "message": "Logged out successfully"}


# Statistics endpoint - no authentication
@app.get("/api/admin/statistics")
async def get_admin_statistics(db: Session = Depends(get_db)):
    """
    Get admin statistics - no authentication required
    Frontend checks admin_logged_in flag
    """
    try:
        # User statistics
        total_citizens = db.query(models.User).filter(
            models.User.role == models.UserRole.CITIZEN
        ).count()
        
        # Officials statistics
        try:
            total_officials = db.query(models.Official).count()
            active_officials = db.query(models.Official).filter(
                models.Official.account_status == models.AccountStatus.ACTIVE
            ).count()
            pending_officials = db.query(models.Official).filter(
                models.Official.account_status == models.AccountStatus.PENDING
            ).count()
        except Exception as e:
            print(f"Error querying officials: {e}")
            total_officials = 0
            active_officials = 0
            pending_officials = 0
        
        # Report statistics
        try:
            total_reports = db.query(models.Report).count()
            pending_reports = db.query(models.Report).filter(
                models.Report.status == models.ReportStatus.PENDING
            ).count()
            in_progress_reports = db.query(models.Report).filter(
                models.Report.status == models.ReportStatus.IN_PROGRESS
            ).count()
            resolved_reports = db.query(models.Report).filter(
                models.Report.status == models.ReportStatus.RESOLVED
            ).count()
        except Exception as e:
            print(f"Error querying reports: {e}")
            total_reports = 0
            pending_reports = 0
            in_progress_reports = 0
            resolved_reports = 0
        
        return {
            "users": {
                "citizens": total_citizens,
                "officials": total_officials,
                "active_officials": active_officials,
                "pending_officials": pending_officials
            },
            "reports": {
                "total": total_reports,
                "pending": pending_reports,
                "in_progress": in_progress_reports,
                "resolved": resolved_reports
            }
        }
        
    except Exception as e:
        print(f"❌ Error getting statistics: {str(e)}")
        import traceback
        print(traceback.format_exc())
        # Return default values instead of error
        return {
            "users": {
                "citizens": 0,
                "officials": 0,
                "active_officials": 0,
                "pending_officials": 0
            },
            "reports": {
                "total": 0,
                "pending": 0,
                "in_progress": 0,
                "resolved": 0
            }
        }


# ==================== ADMIN USER MANAGEMENT ====================

@app.get("/api/admin/users")
async def get_all_users(
    role: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """
    Get all users (citizens and officials combined)
    No authentication - simple admin access
    """
    try:
        all_users = []
        
        # Get Citizens
        citizen_query = db.query(models.User)
        
        if role and role != "official":
            if role == "citizen":
                citizen_query = citizen_query.filter(models.User.role == models.UserRole.CITIZEN)
            elif role == "admin":
                citizen_query = citizen_query.filter(models.User.role == models.UserRole.ADMIN)
        
        if status:
            status_enum = getattr(models.AccountStatus, status.upper(), None)
            if status_enum:
                citizen_query = citizen_query.filter(models.User.account_status == status_enum)
        
        if search:
            citizen_query = citizen_query.filter(
                (models.User.full_name.ilike(f"%{search}%")) |
                (models.User.email.ilike(f"%{search}%"))
            )
        
        citizens = citizen_query.all()
        
        # Convert citizens to dict format
        for citizen in citizens:
            all_users.append({
                "id": citizen.id,
                "full_name": citizen.full_name,
                "email": citizen.email,
                "role": citizen.role.value if hasattr(citizen.role, 'value') else citizen.role,
                "account_status": citizen.account_status.value if hasattr(citizen.account_status, 'value') else citizen.account_status,
                "is_active": citizen.is_active if hasattr(citizen, 'is_active') else True,
                "phone_number": getattr(citizen, 'phone_number', None),
                "created_at": str(citizen.created_at),
                "user_type": "user"
            })
        
        # Get Officials
        if not role or role == "official":
            official_query = db.query(models.Official)
            
            if status:
                status_enum = getattr(models.AccountStatus, status.upper(), None)
                if status_enum:
                    official_query = official_query.filter(models.Official.account_status == status_enum)
            
            if search:
                official_query = official_query.filter(
                    (models.Official.full_name.ilike(f"%{search}%")) |
                    (models.Official.email.ilike(f"%{search}%"))
                )
            
            officials = official_query.all()
            
            # Convert officials to dict format
            for official in officials:
                all_users.append({
                    "id": official.id,
                    "full_name": official.full_name,
                    "email": official.email,
                    "role": "official",
                    "account_status": official.account_status.value if hasattr(official.account_status, 'value') else official.account_status,
                    "is_active": official.is_active if hasattr(official, 'is_active') else True,
                    "phone_number": getattr(official, 'phone_number', None),
                    "department": getattr(official, 'department', None),
                    "designation": getattr(official, 'designation', None),
                    "created_at": str(official.created_at),
                    "user_type": "official"
                })
        
        # Apply pagination
        total = len(all_users)
        paginated_users = all_users[offset:offset + limit]
        
        return {
            "users": paginated_users,
            "total": total
        }
        
    except Exception as e:
        print(f"❌ Error fetching users: {str(e)}")
        import traceback
        print(traceback.format_exc())
        return {"users": [], "total": 0}


@app.get("/api/admin/users/{user_id}")
async def get_user_details(
    user_id: int,
    user_type: str = "user",
    db: Session = Depends(get_db)
):
    """Get detailed user information"""
    try:
        if user_type == "official":
            user = db.query(models.Official).filter(
                models.Official.id == user_id
            ).first()
        else:
            user = db.query(models.User).filter(
                models.User.id == user_id
            ).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Get user statistics
        try:
            total_reports = db.query(models.Report).filter(
                models.Report.citizen_id == user_id
            ).count()
            
            pending_reports = db.query(models.Report).filter(
                models.Report.citizen_id == user_id,
                models.Report.status == models.ReportStatus.PENDING
            ).count()
            
            resolved_reports = db.query(models.Report).filter(
                models.Report.citizen_id == user_id,
                models.Report.status == models.ReportStatus.RESOLVED
            ).count()
            
            statistics = {
                "total_reports": total_reports,
                "pending_reports": pending_reports,
                "resolved_reports": resolved_reports
            }
        except:
            statistics = {
                "total_reports": 0,
                "pending_reports": 0,
                "resolved_reports": 0
            }
        
        # Convert user object to dict
        user_dict = {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role.value if hasattr(user.role, 'value') else "official",
            "account_status": user.account_status.value if hasattr(user.account_status, 'value') else user.account_status,
            "is_active": user.is_active if hasattr(user, 'is_active') else True,
            "created_at": str(user.created_at),
            "phone_number": getattr(user, 'phone_number', None),
            "statistics": statistics
        }
        
        # Add official-specific fields
        if user_type == "official":
            user_dict.update({
                "employee_id": getattr(user, 'employee_id', None),
                "department": getattr(user, 'department', None),
                "designation": getattr(user, 'designation', None),
                "zone": getattr(user, 'zone', None),
                "government_id_url": getattr(user, 'government_id_url', None)
            })
        
        return user_dict
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error fetching user details: {str(e)}")
        import traceback
        print(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch user details"
        )


@app.patch("/api/admin/users/{user_id}/status")
async def update_user_status(
    user_id: int,
    status_data: dict,
    user_type: str = "user",
    db: Session = Depends(get_db)
):
    """
    Update user account status and is_active flag
    """
    try:
        new_status = status_data.get("account_status")
        
        # Get the user
        if user_type == "official":
            user = db.query(models.Official).filter(
                models.Official.id == user_id
            ).first()
        else:
            user = db.query(models.User).filter(
                models.User.id == user_id
            ).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Update status
        if new_status == "active":
            user.account_status = models.AccountStatus.ACTIVE
            # Set is_active to True when activating
            if hasattr(user, 'is_active'):
                user.is_active = True
        elif new_status == "suspended":
            user.account_status = models.AccountStatus.SUSPENDED
            # Set is_active to False when suspending
            if hasattr(user, 'is_active'):
                user.is_active = False
        elif new_status == "blocked":
            user.account_status = models.AccountStatus.BLOCKED
            # Set is_active to False when blocking
            if hasattr(user, 'is_active'):
                user.is_active = False
        elif new_status == "pending":
            user.account_status = models.AccountStatus.PENDING
            # Set is_active to False when pending
            if hasattr(user, 'is_active'):
                user.is_active = False
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid status. Use: active, suspended, blocked, or pending"
            )
        
        db.commit()
        db.refresh(user)
        
        print(f"✅ Updated user {user_id}: status={new_status}, is_active={getattr(user, 'is_active', 'N/A')}")
        
        return {
            "success": True,
            "message": f"User status updated to {new_status}",
            "user": {
                "id": user.id,
                "account_status": user.account_status.value if hasattr(user.account_status, 'value') else user.account_status,
                "is_active": user.is_active if hasattr(user, 'is_active') else True
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error updating user status: {str(e)}")
        import traceback
        print(traceback.format_exc())
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update user status"
        )

# Get pending officials
@app.get("/api/admin/officials/pending")
async def get_pending_officials(db: Session = Depends(get_db)):
    """Get pending officials - no authentication"""
    try:
        officials = db.query(models.Official).filter(
            models.Official.account_status == models.AccountStatus.PENDING
        ).all()
        return officials
    except Exception as e:
        print(f"❌ Error fetching pending officials: {str(e)}")
        return []


# Verify official
@app.patch("/api/admin/officials/{official_id}/verify")
async def verify_official(
    official_id: int,
    action_data: dict,
    db: Session = Depends(get_db)
):
    """Verify or reject an official"""
    try:
        action = action_data.get("action")  # 'approve' or 'reject'
        
        official = db.query(models.Official).filter(
            models.Official.id == official_id
        ).first()
        
        if not official:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Official not found"
            )
        
        if action == "approve":
            official.account_status = models.AccountStatus.ACTIVE
            message = "Official approved successfully"
        elif action == "reject":
            official.account_status = models.AccountStatus.REJECTED
            message = "Official rejected"
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid action"
            )
        
        db.commit()
        
        return {
            "success": True,
            "message": message,
            "official": official
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error verifying official: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to verify official"
        )


# ==================== ADMIN REPORTS MANAGEMENT ====================

@app.get("/api/admin/reports")
async def get_all_reports(
    status: Optional[str] = None,
    priority: Optional[str] = None,
    issue_type: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """
    Get all reports with filters for admin
    No authentication - simple admin access
    """
    try:
        query = db.query(models.Report)
        
        # Apply filters
        if status:
            status_enum = getattr(models.ReportStatus, status.upper(), None)
            if status_enum:
                query = query.filter(models.Report.status == status_enum)
        
        if priority:
            priority_enum = getattr(models.ReportPriority, priority.upper(), None)
            if priority_enum:
                query = query.filter(models.Report.priority == priority_enum)
        
        if issue_type:
            issue_enum = getattr(models.IssueType, issue_type.upper(), None)
            if issue_enum:
                query = query.filter(models.Report.issue_type == issue_enum)
        
        if search:
            query = query.filter(
                (models.Report.title.ilike(f"%{search}%")) |
                (models.Report.description.ilike(f"%{search}%")) |
                (models.Report.address.ilike(f"%{search}%"))
            )
        
        total = query.count()
        reports = query.order_by(models.Report.created_at.desc()).offset(offset).limit(limit).all()
        
        # Convert to dict format with user info
        reports_list = []
        for report in reports:
            # Get user (citizen) info
            user = None
            if report.user_id:
                user = db.query(models.User).filter(
                    models.User.id == report.user_id
                ).first()
            
            # Get assigned official info
            assigned_official = None
            if report.assigned_to:
                assigned_official = db.query(models.Official).filter(
                    models.Official.id == report.assigned_to
                ).first()
            
            # Get images
            images = db.query(models.ReportImage).filter(
                models.ReportImage.report_id == report.id
            ).all()
            
            image_urls = [img.file_path for img in images] if images else []
            
            # Get comments count
            comments_count = db.query(models.ReportComment).filter(
                models.ReportComment.report_id == report.id
            ).count()
            
            reports_list.append({
                "id": report.id,
                "title": report.title,
                "description": report.description,
                "issue_type": report.issue_type.value if hasattr(report.issue_type, 'value') else report.issue_type,
                "status": report.status.value if hasattr(report.status, 'value') else report.status,
                "priority": report.priority.value if hasattr(report.priority, 'value') else report.priority,
                "address": report.address,
                "latitude": float(report.latitude) if report.latitude else None,
                "longitude": float(report.longitude) if report.longitude else None,
                "image_urls": image_urls,
                "is_anonymous": report.is_anonymous,
                "upvotes": report.upvotes,
                "views": report.views,
                "created_at": str(report.created_at),
                "updated_at": str(report.updated_at) if report.updated_at else None,
                "resolved_at": str(report.resolved_at) if report.resolved_at else None,
                "user": {
                    "id": user.id if user else None,
                    "full_name": user.full_name if user else "Anonymous",
                    "email": user.email if user else "N/A"
                } if user and not report.is_anonymous else {"id": None, "full_name": "Anonymous", "email": "N/A"},
                "assigned_official": {
                    "id": assigned_official.id if assigned_official else None,
                    "full_name": assigned_official.full_name if assigned_official else None,
                    "department": assigned_official.department if assigned_official else None
                } if assigned_official else None,
                "assigned_zone": report.assigned_zone,
                "comments_count": comments_count
            })
        
        return {
            "reports": reports_list,
            "total": total
        }
        
    except Exception as e:
        print(f"❌ Error fetching reports: {str(e)}")
        import traceback
        print(traceback.format_exc())
        return {"reports": [], "total": 0}


@app.get("/api/admin/reports/{report_id}")
async def get_report_details(
    report_id: int,
    db: Session = Depends(get_db)
):
    """Get detailed report information for admin"""
    try:
        report = db.query(models.Report).filter(
            models.Report.id == report_id
        ).first()
        
        if not report:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Report not found"
            )
        
        # Get user info
        user = None
        if report.user_id:
            user = db.query(models.User).filter(
                models.User.id == report.user_id
            ).first()
        
        # Get assigned official
        assigned_official = None
        if report.assigned_to:
            assigned_official = db.query(models.Official).filter(
                models.Official.id == report.assigned_to
            ).first()
        
        # Get images
        images = db.query(models.ReportImage).filter(
            models.ReportImage.report_id == report_id
        ).order_by(models.ReportImage.display_order).all()
        
        image_list = [{
            "id": img.id,
            "filename": img.filename,
            "file_path": img.file_path,
            "mime_type": img.mime_type,
            "uploaded_at": str(img.uploaded_at)
        } for img in images]
        
        # Get comments
        comments = db.query(models.ReportComment).filter(
            models.ReportComment.report_id == report_id
        ).order_by(models.ReportComment.created_at.desc()).all()
        
        comments_list = [{
            "id": comment.id,
            "user_id": comment.user_id,
            "user_role": comment.user_role.value if hasattr(comment.user_role, 'value') else comment.user_role,
            "comment": comment.comment,
            "is_internal": comment.is_internal,
            "created_at": str(comment.created_at)
        } for comment in comments]
        
        # Get status history
        status_history = db.query(models.ReportStatusHistory).filter(
            models.ReportStatusHistory.report_id == report_id
        ).order_by(models.ReportStatusHistory.created_at.desc()).all()
        
        history_list = [{
            "id": hist.id,
            "old_status": hist.old_status.value if hist.old_status and hasattr(hist.old_status, 'value') else hist.old_status,
            "new_status": hist.new_status.value if hasattr(hist.new_status, 'value') else hist.new_status,
            "changed_by": hist.changed_by,
            "changed_by_role": hist.changed_by_role.value if hasattr(hist.changed_by_role, 'value') else hist.changed_by_role,
            "comment": hist.comment,
            "created_at": str(hist.created_at)
        } for hist in status_history]
        
        report_dict = {
            "id": report.id,
            "title": report.title,
            "description": report.description,
            "issue_type": report.issue_type.value if hasattr(report.issue_type, 'value') else report.issue_type,
            "status": report.status.value if hasattr(report.status, 'value') else report.status,
            "priority": report.priority.value if hasattr(report.priority, 'value') else report.priority,
            "address": report.address,
            "latitude": float(report.latitude) if report.latitude else None,
            "longitude": float(report.longitude) if report.longitude else None,
            "is_anonymous": report.is_anonymous,
            "upvotes": report.upvotes,
            "views": report.views,
            "created_at": str(report.created_at),
            "updated_at": str(report.updated_at) if report.updated_at else None,
            "resolved_at": str(report.resolved_at) if report.resolved_at else None,
            "closed_at": str(report.closed_at) if report.closed_at else None,
            "user": {
                "id": user.id if user else None,
                "full_name": user.full_name if user else "Anonymous",
                "email": user.email if user else "N/A",
                "phone_number": user.phone_number if user and hasattr(user, 'phone_number') else None
            } if user and not report.is_anonymous else {"id": None, "full_name": "Anonymous", "email": "N/A", "phone_number": None},
            "assigned_official": {
                "id": assigned_official.id if assigned_official else None,
                "full_name": assigned_official.full_name if assigned_official else None,
                "email": assigned_official.email if assigned_official else None,
                "department": assigned_official.department if assigned_official else None,
                "designation": assigned_official.designation if assigned_official else None
            } if assigned_official else None,
            "assigned_zone": report.assigned_zone,
            "images": image_list,
            "comments": comments_list,
            "status_history": history_list
        }
        
        return report_dict
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error fetching report details: {str(e)}")
        import traceback
        print(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch report details"
        )


@app.patch("/api/admin/reports/{report_id}/status")
async def update_report_status(
    report_id: int,
    status_data: dict,
    db: Session = Depends(get_db)
):
    """Update report status and create status history"""
    try:
        new_status = status_data.get("status")
        comment = status_data.get("comment", "Status updated by admin")
        
        report = db.query(models.Report).filter(
            models.Report.id == report_id
        ).first()
        
        if not report:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Report not found"
            )
        
        # Get old status
        old_status = report.status
        
        # Update status
        valid_statuses = ['pending', 'under_review', 'in_progress', 'resolved', 'rejected', 'closed']
        if new_status and new_status.lower() in valid_statuses:
            status_enum = getattr(models.ReportStatus, new_status.upper(), None)
            if status_enum:
                report.status = status_enum
                
                # Update timestamps
                from datetime import datetime
                report.updated_at = datetime.utcnow()
                
                if new_status.lower() == 'resolved':
                    report.resolved_at = datetime.utcnow()
                elif new_status.lower() == 'closed':
                    report.closed_at = datetime.utcnow()
                
                # Create status history entry
                status_history = models.ReportStatusHistory(
                    report_id=report_id,
                    old_status=old_status,
                    new_status=status_enum,
                    changed_by=1,  # Admin user ID (you can pass this from context)
                    changed_by_role=models.UserRole.ADMIN,
                    comment=comment
                )
                db.add(status_history)
                
                db.commit()
                db.refresh(report)
                
                print(f"✅ Updated report {report_id} status from {old_status} to {new_status}")
                
                return {
                    "success": True,
                    "message": f"Report status updated to {new_status}",
                    "report": {
                        "id": report.id,
                        "status": report.status.value if hasattr(report.status, 'value') else report.status,
                        "updated_at": str(report.updated_at)
                    }
                }
        
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Use: {', '.join(valid_statuses)}"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error updating report status: {str(e)}")
        import traceback
        print(traceback.format_exc())
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update report status"
        )


@app.delete("/api/admin/reports/{report_id}")
async def delete_report(
    report_id: int,
    db: Session = Depends(get_db)
):
    """Delete a report (admin only) - cascade will handle related records"""
    try:
        report = db.query(models.Report).filter(
            models.Report.id == report_id
        ).first()
        
        if not report:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Report not found"
            )
        
        # Delete the report (cascade will delete images, comments, status_history)
        db.delete(report)
        db.commit()
        
        print(f"✅ Deleted report {report_id}")
        
        return {
            "success": True,
            "message": "Report deleted successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error deleting report: {str(e)}")
        import traceback
        print(traceback.format_exc())
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete report"
        )


@app.patch("/api/admin/reports/{report_id}/priority")
async def update_report_priority(
    report_id: int,
    priority_data: dict,
    db: Session = Depends(get_db)
):
    """Update report priority"""
    try:
        new_priority = priority_data.get("priority")
        
        report = db.query(models.Report).filter(
            models.Report.id == report_id
        ).first()
        
        if not report:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Report not found"
            )
        
        # Update priority
        valid_priorities = ['low', 'medium', 'high', 'critical']
        if new_priority and new_priority.lower() in valid_priorities:
            priority_enum = getattr(models.ReportPriority, new_priority.upper(), None)
            if priority_enum:
                report.priority = priority_enum
                
                from datetime import datetime
                report.updated_at = datetime.utcnow()
                
                db.commit()
                db.refresh(report)
                
                return {
                    "success": True,
                    "message": f"Report priority updated to {new_priority}"
                }
        
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid priority. Use: {', '.join(valid_priorities)}"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error updating report priority: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update report priority"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000, reload=True)