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


# print("🗑️  Dropping all tables...")
# Base.metadata.drop_all(bind=engine)

print("🔨 Creating all tables from models...")
Base.metadata.create_all(bind=engine)

print("✅ Database setup complete!")

app = FastAPI(title="RoadSense.ai API", version="1.0.0")

origins = os.environ.get("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

# 8. DELETE REPORT (User or Admin)
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

# 9. GET REPORT STATUS HISTORY
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

# 10. SERVE REPORT IMAGE
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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000, reload=True)