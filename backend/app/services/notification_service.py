from datetime import datetime
from app.database.mongo import get_database
from app.models.notification import NotificationCreate
from app.utils.mongo import mongo_to_dict
from bson import ObjectId

async def create_notification(notification_data: NotificationCreate):
    """Create a new notification"""
    db = await get_database()
    notification = {
        "user_id": notification_data.user_id,
        "title": notification_data.title,
        "message": notification_data.message,
        "notification_type": notification_data.notification_type,
        "link": notification_data.link,
        "is_read": False,
        "created_at": datetime.utcnow()
    }
    result = await db.notifications.insert_one(notification)
    notification["_id"] = result.inserted_id
    return mongo_to_dict(notification)

async def get_user_notifications(user_id: str, unread_only: bool = False):
    """Get notifications for a user"""
    db = await get_database()
    query = {"user_id": user_id}
    if unread_only:
        query["is_read"] = False
    
    cursor = db.notifications.find(query).sort("created_at", -1)
    notifications = []
    async for doc in cursor:
        notifications.append(mongo_to_dict(doc))
    return notifications

async def mark_notification_read(notification_id: str, user_id: str):
    """Mark a notification as read"""
    db = await get_database()
    await db.notifications.update_one(
        {"_id": ObjectId(notification_id), "user_id": user_id},
        {"$set": {"is_read": True}}
    )
    return {"message": "Notification marked as read"}

async def get_unread_count(user_id: str) -> int:
    """Get count of unread notifications"""
    db = await get_database()
    count = await db.notifications.count_documents({
        "user_id": user_id,
        "is_read": False
    })
    return count
