from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List
from datetime import datetime
import re
from enum import Enum

class CitizenRegister(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    password: str = Field(..., min_length=8)
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one number')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError('Password must contain at least one special character')
        return v

class OfficialRegister(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    phone_number: str = Field(..., pattern=r'^\d{10}$')
    employee_id: str = Field(..., min_length=4)
    department: str
    designation: str
    zone: str
    password: str = Field(..., min_length=8)
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one number')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError('Password must contain at least one special character')
        return v
    
    @field_validator('email')
    @classmethod
    def validate_official_email(cls, v):
        gov_domains = ['.gov.in', '.nic.in', '.gov']
        if not any(v.lower().endswith(domain) for domain in gov_domains):
            raise ValueError('Official registration requires a government email domain')
        return v

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    account_status: str

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    role: str
    account_status: str
    created_at: datetime

    class Config:
        from_attributes = True
        
class IssueTypeEnum(str, Enum):
    POTHOLE = "pothole"
    CRACK = "crack"
    DEBRIS = "debris"
    FADED_MARKING = "faded_marking"
    STREET_LIGHT = "street_light"
    TRAFFIC_SIGN = "traffic_sign"
    DRAINAGE = "drainage"
    OTHER = "other"

class ReportStatusEnum(str, Enum):
    PENDING = "pending"
    UNDER_REVIEW = "under_review"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"
    REJECTED = "rejected"

class ReportPriorityEnum(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

# Location Schema
class LocationSchema(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    address: str = Field(..., min_length=5)

# Report Image Response Schema
class ReportImageResponse(BaseModel):
    id: int
    filename: str
    file_path: str
    file_size: int
    mime_type: str
    display_order: int
    uploaded_at: datetime
    
    class Config:
        from_attributes = True

# Report Create Schema
class ReportCreate(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    address: str = Field(..., min_length=5)
    issue_type: IssueTypeEnum
    title: str = Field(..., min_length=5, max_length=255)
    description: str = Field(..., min_length=10)
    is_anonymous: bool = False

# Report Response Schema
class ReportResponse(BaseModel):
    id: int
    user_id: int
    latitude: float
    longitude: float
    address: str
    issue_type: str
    title: str
    description: str
    status: str
    priority: str
    assigned_to: Optional[int] = None
    assigned_zone: Optional[str] = None
    is_anonymous: bool
    upvotes: int
    views: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None
    closed_at: Optional[datetime] = None
    images: List[ReportImageResponse] = []
    
    class Config:
        from_attributes = True

# Report List Response (without images for performance)
class ReportListResponse(BaseModel):
    id: int
    user_id: int
    latitude: float
    longitude: float
    address: str
    issue_type: str
    title: str
    status: str
    priority: str
    created_at: datetime
    image_count: int = 0
    
    class Config:
        from_attributes = True

# Report Status Update Schema
class ReportStatusUpdate(BaseModel):
    status: ReportStatusEnum
    comment: Optional[str] = None
    priority: Optional[ReportPriorityEnum] = None

# Report Assignment Schema
class ReportAssignment(BaseModel):
    official_id: int
    comment: Optional[str] = None

# Comment Create Schema
class CommentCreate(BaseModel):
    comment: str = Field(..., min_length=1, max_length=2000)
    is_internal: bool = False

# Comment Response Schema
class CommentResponse(BaseModel):
    id: int
    report_id: int
    user_id: int
    user_role: str
    comment: str
    is_internal: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Status History Response Schema
class StatusHistoryResponse(BaseModel):
    id: int
    old_status: Optional[str]
    new_status: str
    changed_by: int
    changed_by_role: str
    comment: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True
