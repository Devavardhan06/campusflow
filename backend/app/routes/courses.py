from fastapi import APIRouter, Depends, HTTPException, status
from app.utils.auth import get_current_user, get_current_admin
from app.utils.mongo import mongo_to_dict
from app.models.course import CourseCreate, CourseRegistration
from app.database.mongo import get_database
from bson import ObjectId
from datetime import datetime

router = APIRouter()

@router.get("/")
async def get_available_courses(current_user: dict = Depends(get_current_user)):
    db = await get_database()
    
    cursor = db.courses.find({})
    courses = []
    async for course in cursor:
        courses.append(mongo_to_dict(course))
    
    return {"courses": courses}

@router.get("/my-courses")
async def get_my_courses(current_user: dict = Depends(get_current_user)):
    db = await get_database()
    user_id = current_user["id"]
    
    # Check fee payment status
    fee = await db.fees.find_one({"user_id": user_id})
    fee_percentage = 0
    if fee and fee.get("total_amount", 0) > 0:
        fee_percentage = (fee.get("paid_amount", 0) / fee.get("total_amount", 1)) * 100
    
    if fee_percentage < 50:
        return {
            "courses": [],
            "message": "Please complete at least 50% fee payment to register for courses",
            "fee_percentage": fee_percentage,
            "locked": True
        }
    
    cursor = db.student_courses.find({"user_id": user_id})
    courses = []
    async for sc in cursor:
        course = await db.courses.find_one({"_id": ObjectId(sc["course_id"])})
        if course:
            sc_dict = mongo_to_dict(sc)
            sc_dict["course"] = mongo_to_dict(course)
            courses.append(sc_dict)
    
    return {
        "courses": courses,
        "locked": False
    }

@router.post("/register")
async def register_courses(
    registration: CourseRegistration,
    current_user: dict = Depends(get_current_user)
):
    db = await get_database()
    user_id = current_user["id"]
    
    # Check fee payment status
    fee = await db.fees.find_one({"user_id": user_id})
    fee_percentage = 0
    if fee and fee.get("total_amount", 0) > 0:
        fee_percentage = (fee.get("paid_amount", 0) / fee.get("total_amount", 1)) * 100
    
    if fee_percentage < 50:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please complete at least 50% fee payment to register for courses"
        )
    
    registered_courses = []
    for course_id in registration.course_ids:
        # Check if already registered
        existing = await db.student_courses.find_one({
            "user_id": user_id,
            "course_id": course_id
        })
        if existing:
            continue
        
        # Verify course exists
        course = await db.courses.find_one({"_id": ObjectId(course_id)})
        if not course:
            continue
        
        await db.student_courses.insert_one({
            "user_id": user_id,
            "course_id": course_id,
            "registered_at": datetime.utcnow(),
            "lms_activated": False
        })
        registered_courses.append(course_id)
    
    # Create notification
    if registered_courses:
        from app.services.notification_service import create_notification
        from app.models.notification import NotificationType, NotificationCreate
        await create_notification(NotificationCreate(
            user_id=user_id,
            title="Course Registration",
            message=f"Successfully registered for {len(registered_courses)} course(s).",
            notification_type=NotificationType.TASK_COMPLETION,
            link="/courses"
        ))
    
    return {"message": f"Registered for {len(registered_courses)} course(s)", "courses": registered_courses}

@router.post("/create", dependencies=[Depends(get_current_admin)])
async def create_course(course_data: CourseCreate):
    db = await get_database()
    
    course = {
        "course_code": course_data.course_code,
        "course_name": course_data.course_name,
        "credits": course_data.credits,
        "description": course_data.description,
        "created_at": datetime.utcnow()
    }
    
    result = await db.courses.insert_one(course)
    course["_id"] = result.inserted_id
    return mongo_to_dict(course)

@router.put("/{course_id}/activate-lms")
async def activate_lms(
    course_id: str,
    current_user: dict = Depends(get_current_user)
):
    db = await get_database()
    user_id = current_user["id"]
    
    await db.student_courses.update_one(
        {"user_id": user_id, "course_id": course_id},
        {"$set": {"lms_activated": True}}
    )
    
    return {"message": "LMS activated successfully"}
