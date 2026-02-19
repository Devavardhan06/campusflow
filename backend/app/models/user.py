from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from enum import Enum

class Role(str, Enum):
    STUDENT = "student"
    ADMIN = "admin"

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    student_id: Optional[str] = None
    role: Role = Role.STUDENT

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    student_id: Optional[str]
    role: Role
    avatar_url: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

class User(BaseModel):
    email: str
    full_name: str
    student_id: Optional[str]
    role: Role
    password_hash: str
    avatar_url: Optional[str]
    created_at: datetime
