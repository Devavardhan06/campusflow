from fastapi import APIRouter, Depends
from app.utils.auth import get_current_user
from app.services.notification_service import get_user_notifications, mark_notification_read, get_unread_count

router = APIRouter()

@router.get("/")
async def get_notifications(
    unread_only: bool = False,
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["id"]
    notifications = await get_user_notifications(user_id, unread_only)
    return {"notifications": notifications}

@router.get("/unread-count")
async def get_unread_notification_count(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    count = await get_unread_count(user_id)
    return {"count": count}

@router.put("/{notification_id}/read")
async def mark_as_read(
    notification_id: str,
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["id"]
    result = await mark_notification_read(notification_id, user_id)
    return result
