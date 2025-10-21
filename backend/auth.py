from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database import get_db
import models
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.environ.get("SECRET_KEY", "your-secret-key-change-this")
ALGORITHM = os.environ.get("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def detect_user_role(email: str) -> str:
    """Detect user role based on email domain"""
    gov_domains = ['.gov.in', '.nic.in', '.gov']
    email_lower = email.lower().strip()
    
    for domain in gov_domains:
        if email_lower.endswith(domain):
            return "official"
    
    return "citizen"

def authenticate_user(db: Session, email: str, password: str):
    """Authenticate user by email and password - checks both User and Official tables"""
    email = email.lower().strip()
    
    role = detect_user_role(email)
    
    if role == "official":
        user = db.query(models.Official).filter(models.Official.email == email).first()
    else:
        user = db.query(models.User).filter(models.User.email == email).first()
    
    if not user:
        if role == "official":
            user = db.query(models.User).filter(models.User.email == email).first()
        else:
            user = db.query(models.Official).filter(models.Official.email == email).first()
    
    if not user:
        return None
    
    if not verify_password(password, user.password_hash):
        return None
    
    return user

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Get current authenticated user from token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        role: str = payload.get("role")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    if role == "official":
        user = db.query(models.Official).filter(models.Official.email == email).first()
    else:
        user = db.query(models.User).filter(models.User.email == email).first()
    
    if user is None:
        raise credentials_exception
    return user