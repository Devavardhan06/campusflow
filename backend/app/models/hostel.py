from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

class HostelStatus(str, Enum):
    PENDING = "pending"
    ALLOCATED = "allocated"
    REJECTED = "rejected"

class MessStatus(str, Enum):
    NOT_REGISTERED = "not_registered"
    REGISTERED = "registered"

class HostelPreference(BaseModel):
    preference_1: Optional[str] = None
    preference_2: Optional[str] = None
    preference_3: Optional[str] = None

class HostelCreate(BaseModel):
    name: str
    capacity: int
    available_rooms: int

class HostelApplication(BaseModel):
    id: str
    user_id: str
    preferences: HostelPreference
    allocated_hostel: Optional[str]
    allocated_room: Optional[str]
    status: HostelStatus
    mess_registration: MessStatus
    applied_at: datetime
    allocated_at: Optional[datetime]
