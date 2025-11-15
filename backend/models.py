from sqlalchemy import Column, Integer, String, DateTime, Enum as SQLEnum, Boolean, Float, Text, ForeignKey
from sqlalchemy.orm import relationship
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
    phone_number = Column(String(20), nullable=True)  # ADD IF MISSING
    password_hash = Column(String(255), nullable=False)
    role = Column(SQLEnum(UserRole), nullable=False, default=UserRole.CITIZEN)
    account_status = Column(SQLEnum(AccountStatus), nullable=False, default=AccountStatus.ACTIVE)
    profile_image_url = Column(String(500), nullable=True)  # ADD IF MISSING
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

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
    

class ReportStatus(str, enum.Enum):
    PENDING = "pending"
    UNDER_REVIEW = "under_review"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"
    REJECTED = "rejected"

class ReportPriority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class IssueType(str, enum.Enum):
    POTHOLE = "pothole"
    CRACK = "crack"
    DEBRIS = "debris"
    FADED_MARKING = "faded_marking"
    STREET_LIGHT = "street_light"
    TRAFFIC_SIGN = "traffic_sign"
    DRAINAGE = "drainage"
    OTHER = "other"

# Report Model
class Report(Base):
    __tablename__ = "reports"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    address = Column(Text, nullable=False)
    issue_type = Column(SQLEnum(IssueType), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(SQLEnum(ReportStatus), nullable=False, default=ReportStatus.PENDING, index=True)
    priority = Column(SQLEnum(ReportPriority), default=ReportPriority.MEDIUM)
    assigned_to = Column(Integer, ForeignKey("officials.id"), nullable=True)
    assigned_zone = Column(String(255), nullable=True)
    is_anonymous = Column(Boolean, default=False)
    upvotes = Column(Integer, default=0)
    views = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    resolved_at = Column(DateTime(timezone=True), nullable=True)
    closed_at = Column(DateTime(timezone=True), nullable=True)
    user = relationship("User", backref="reports")
    official = relationship("Official", backref="assigned_reports", foreign_keys=[assigned_to])
    images = relationship("ReportImage", back_populates="report", cascade="all, delete-orphan")
    comments = relationship("ReportComment", back_populates="report", cascade="all, delete-orphan")
    status_history = relationship("ReportStatusHistory", back_populates="report", cascade="all, delete-orphan")

# Report Image Model (One-to-Many relationship)
class ReportImage(Base):
    __tablename__ = "report_images"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    report_id = Column(Integer, ForeignKey("reports.id"), nullable=False, index=True)
    filename = Column(String(500), nullable=False)
    file_path = Column(String(1000), nullable=False)
    file_size = Column(Integer, nullable=False)  # in bytes
    mime_type = Column(String(100), nullable=False)
    display_order = Column(Integer, default=0)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    report = relationship("Report", back_populates="images")

class ReportStatusHistory(Base):
    __tablename__ = "report_status_history"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    report_id = Column(Integer, ForeignKey("reports.id"), nullable=False, index=True)
    old_status = Column(SQLEnum(ReportStatus), nullable=True)
    new_status = Column(SQLEnum(ReportStatus), nullable=False)
    changed_by = Column(Integer, nullable=False)  
    changed_by_role = Column(SQLEnum(UserRole), nullable=False)
    comment = Column(Text, nullable=True)    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    report = relationship("Report", back_populates="status_history")

class ReportComment(Base):
    __tablename__ = "report_comments"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    report_id = Column(Integer, ForeignKey("reports.id"), nullable=False, index=True)
    user_id = Column(Integer, nullable=False) 
    user_role = Column(SQLEnum(UserRole), nullable=False)
    
    comment = Column(Text, nullable=False)
    is_internal = Column(Boolean, default=False) 
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    report = relationship("Report", back_populates="comments")
    
class Admin(Base):
    __tablename__ = "admins"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    role = Column(String(50), default="admin")
    is_super_admin = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)