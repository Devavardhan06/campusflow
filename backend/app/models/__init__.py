from .user import User, UserCreate, UserLogin, UserResponse
from .document import Document, DocumentCreate, DocumentUpdate
from .fee import Fee, FeeCreate, FeePayment, Transaction
from .course import Course, CourseRegistration, CourseCreate
from .hostel import HostelApplication, HostelPreference, HostelCreate
from .notification import Notification, NotificationCreate

__all__ = [
    "User", "UserCreate", "UserLogin", "UserResponse",
    "Document", "DocumentCreate", "DocumentUpdate",
    "Fee", "FeeCreate", "FeePayment", "Transaction",
    "Course", "CourseRegistration", "CourseCreate",
    "HostelApplication", "HostelPreference", "HostelCreate",
    "Notification", "NotificationCreate"
]
