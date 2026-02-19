from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.utils.auth import get_current_user, get_current_admin
from app.utils.mongo import mongo_to_dict
from app.models.hostel import HostelPreference, HostelCreate, HostelStatus, MessStatus
from app.database.mongo import get_database
from bson import ObjectId
from datetime import datetime

router = APIRouter()

@router.get("/")
async def get_hostel_status(current_user: dict = Depends(get_current_user)):
    db = await get_database()
    user_id = current_user["id"]
    
    application = await db.hostel_applications.find_one({"user_id": user_id})
    if not application:
        return {
            "application": None,
            "status": "not_applied",
            "is_hosteller": False,
            "attendance": []
        }
    
    application = mongo_to_dict(application)
    application["is_hosteller"] = application.get("status") == HostelStatus.ALLOCATED.value
    
    # Get attendance records (last 14 days)
    from datetime import timedelta
    import random
    start_date = datetime.utcnow().date() - timedelta(days=14)
    cursor = db.hostel_attendance.find({
        "user_id": user_id,
        "date": {"$gte": start_date.isoformat()}
    }).sort("date", -1).limit(14)
    
    attendance = []
    async for record in cursor:
        attendance.append(mongo_to_dict(record))
    
    # If hosteller but no attendance, generate sample for last 14 days (for demo)
    if application["is_hosteller"] and not attendance:
        for i in range(14):
            d = (datetime.utcnow().date() - timedelta(days=i)).isoformat()
            status_val = random.choice(["present", "present", "present", "absent", "leave"])
            attendance.append({"date": d, "status": status_val, "id": f"sample-{i}"})
        attendance.sort(key=lambda x: x["date"], reverse=True)
    
    return {
        "application": application,
        "status": application.get("status", "not_applied"),
        "is_hosteller": application["is_hosteller"],
        "attendance": attendance
    }

@router.get("/attendance")
async def get_attendance(current_user: dict = Depends(get_current_user)):
    db = await get_database()
    user_id = current_user["id"]
    
    application = await db.hostel_applications.find_one({"user_id": user_id})
    if not application or application.get("status") != HostelStatus.ALLOCATED.value:
        return {"attendance": [], "message": "Not a hosteller"}
    
    cursor = db.hostel_attendance.find({"user_id": user_id}).sort("date", -1).limit(30)
    attendance = []
    async for record in cursor:
        attendance.append(mongo_to_dict(record))
    
    return {"attendance": attendance}

@router.post("/attendance/mark")
async def mark_attendance(
    date: str,
    status: str,  # present, absent, leave
    current_user: dict = Depends(get_current_user)
):
    """Simulate marking attendance (or auto-mark for demo)"""
    db = await get_database()
    user_id = current_user["id"]
    
    application = await db.hostel_applications.find_one({"user_id": user_id})
    if not application or application.get("status") != HostelStatus.ALLOCATED.value:
        raise HTTPException(status_code=403, detail="Not a hosteller")
    
    await db.hostel_attendance.update_one(
        {"user_id": user_id, "date": date},
        {"$set": {"user_id": user_id, "date": date, "status": status, "marked_at": datetime.utcnow()}},
        upsert=True
    )
    
    return {"message": "Attendance marked", "date": date, "status": status}

@router.post("/apply")
async def apply_hostel(
    preferences: HostelPreference,
    current_user: dict = Depends(get_current_user)
):
    db = await get_database()
    user_id = current_user["id"]
    
    # Check if already applied
    existing = await db.hostel_applications.find_one({"user_id": user_id})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Hostel application already submitted"
        )
    
    application = {
        "user_id": user_id,
        "preferences": {
            "preference_1": preferences.preference_1,
            "preference_2": preferences.preference_2,
            "preference_3": preferences.preference_3
        },
        "allocated_hostel": None,
        "allocated_room": None,
        "status": HostelStatus.PENDING.value,
        "mess_registration": MessStatus.NOT_REGISTERED.value,
        "applied_at": datetime.utcnow(),
        "allocated_at": None
    }
    
    result = await db.hostel_applications.insert_one(application)
    application["_id"] = result.inserted_id
    
    # Create notification
    from app.services.notification_service import create_notification
    from app.models.notification import NotificationType, NotificationCreate
    await create_notification(NotificationCreate(
        user_id=user_id,
        title="Hostel Application Submitted",
        message="Your hostel application has been submitted successfully.",
        notification_type=NotificationType.TASK_COMPLETION,
        link="/hostel"
    ))
    
    return {"message": "Hostel application submitted", "application": mongo_to_dict(application)}

@router.put("/mess-register")
async def register_mess(current_user: dict = Depends(get_current_user)):
    db = await get_database()
    user_id = current_user["id"]
    
    application = await db.hostel_applications.find_one({"user_id": user_id})
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hostel application not found"
        )
    
    if application["status"] != HostelStatus.ALLOCATED.value:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Hostel not allocated yet"
        )
    
    await db.hostel_applications.update_one(
        {"user_id": user_id},
        {"$set": {"mess_registration": MessStatus.REGISTERED.value}}
    )
    
    return {"message": "Mess registration successful"}

@router.get("/available")
async def get_available_hostels(current_user: dict = Depends(get_current_user)):
    db = await get_database()
    
    cursor = db.hostels.find({})
    hostels = []
    async for hostel in cursor:
        hostels.append(mongo_to_dict(hostel))
    
    return {"hostels": hostels}

@router.post("/create", dependencies=[Depends(get_current_admin)])
async def create_hostel(hostel_data: HostelCreate):
    db = await get_database()
    
    hostel = {
        "name": hostel_data.name,
        "capacity": hostel_data.capacity,
        "available_rooms": hostel_data.available_rooms,
        "created_at": datetime.utcnow()
    }
    
    result = await db.hostels.insert_one(hostel)
    hostel["_id"] = result.inserted_id
    return mongo_to_dict(hostel)

@router.put("/{application_id}/allocate", dependencies=[Depends(get_current_admin)])
async def allocate_hostel(
    application_id: str,
    hostel_name: str = Query(...),
    room_number: str = Query(...)
):
    db = await get_database()
    
    result = await db.hostel_applications.update_one(
        {"_id": ObjectId(application_id)},
        {
            "$set": {
                "allocated_hostel": hostel_name,
                "allocated_room": room_number,
                "status": HostelStatus.ALLOCATED.value,
                "allocated_at": datetime.utcnow()
            }
        }
    )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    # Get application to create notification
    app = await db.hostel_applications.find_one({"_id": ObjectId(application_id)})
    
    # Create notification
    from app.services.notification_service import create_notification
    from app.models.notification import NotificationType, NotificationCreate
    await create_notification(NotificationCreate(
        user_id=app["user_id"],
        title="Hostel Allocated",
        message=f"Your hostel application has been approved. Hostel: {hostel_name}, Room: {room_number}",
        notification_type=NotificationType.TASK_COMPLETION,
        link="/hostel"
    ))
    
    return {"message": "Hostel allocated successfully"}
