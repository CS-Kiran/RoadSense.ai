from sqlalchemy import Column, Integer, String, DateTime, Enum as SQLEnum, Boolean
from sqlalchemy.sql import func
from database import Base
import enum

class AccountStatus(str, enum.Enum):
    ACTIVE = "active"
    PENDING = "pending"
    SUSPENDED = "suspended"
    BLOCKED = "blocked"

class UserRole(str, enum.Enum):
    CITIZEN = "citizen"
    OFFICIAL = "official"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone_number = Column(String(20), nullable=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(SQLEnum(UserRole), nullable=False, default=UserRole.CITIZEN)
    account_status = Column(SQLEnum(AccountStatus), nullable=False, default=AccountStatus.ACTIVE)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Official(Base):
    __tablename__ = "officials"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, nullable=False, unique=True)  # Reference to users table
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone_number = Column(String(20), nullable=False)
    password_hash = Column(String(255), nullable=False)
    employee_id = Column(String(100), unique=True, nullable=False)
    department = Column(String(255), nullable=False)
    designation = Column(String(255), nullable=False)
    zone = Column(String(255), nullable=False)
    government_id_url = Column(String(500), nullable=True)  # Store file path
    role = Column(SQLEnum(UserRole), nullable=False, default=UserRole.OFFICIAL)
    account_status = Column(SQLEnum(AccountStatus), nullable=False, default=AccountStatus.PENDING)
    is_active = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())