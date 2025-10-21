from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import timedelta
import schemas
import models
import auth
from database import engine, get_db, Base
import os
import shutil
from typing import Optional
from auth import get_current_user

Base.metadata.create_all(bind=engine)

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000, reload=True)