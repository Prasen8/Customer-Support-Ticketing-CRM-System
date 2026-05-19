from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# ==================== USER SCHEMAS ====================

class UserRegister(BaseModel):
    username: str
    email: str
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    username: str
    role: str


# ==================== TICKET SCHEMAS ====================

class TicketCreate(BaseModel):
    subject: str
    description: str
    category: Optional[str] = "Other"    # ✅ added
    priority: Optional[str] = "Low"      # ✅ added


class TicketUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None


class TicketResponse(BaseModel):
    id: int
    ticket_id: str
    customer_id: int
    customer_name: str
    customer_email: str
    subject: str
    description: str
    category: Optional[str] = None       # ✅ added
    priority: Optional[str] = None       # ✅ added
    status: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True