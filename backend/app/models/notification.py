from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

class NotificationType(str, Enum):
    RISK = "risk"
    TASK_COMPLETION = "task_completion"
    DEADLINE = "deadline"
    INFO = "info"

class NotificationCreate(BaseModel):
    user_id: str
    title: str
    message: str
    notification_type: NotificationType
    link: Optional[str] = None

class Notification(BaseModel):
    id: str
    user_id: str
    title: str
    message: str
    notification_type: NotificationType
    link: Optional[str]
    is_read: bool
    created_at: datetime
