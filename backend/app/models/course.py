from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CourseCreate(BaseModel):
    course_code: str
    course_name: str
    credits: int
    description: Optional[str] = None

class CourseRegistration(BaseModel):
    course_ids: List[str]

class Course(BaseModel):
    id: str
    course_code: str
    course_name: str
    credits: int
    description: Optional[str]
    created_at: datetime

class StudentCourse(BaseModel):
    id: str
    user_id: str
    course_id: str
    course: Course
    registered_at: datetime
    lms_activated: bool
