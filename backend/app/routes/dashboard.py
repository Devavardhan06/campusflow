from fastapi import APIRouter, Depends
from app.utils.auth import get_current_user
from app.utils.onboarding import calculate_completion, calculate_health_score, detect_risk, get_next_best_action
from app.services.notification_service import get_unread_count

router = APIRouter()

@router.get("/overview")
async def get_dashboard_overview(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    
    completion = await calculate_completion(user_id)
    health_score = await calculate_health_score(user_id)
    risk = await detect_risk(user_id)
    next_action = await get_next_best_action(user_id)
    unread_count = await get_unread_count(user_id)
    
    return {
        "completion": completion,
        "health_score": health_score,
        "risk": risk,
        "next_best_action": next_action,
        "unread_notifications": unread_count
    }
