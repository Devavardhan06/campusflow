from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.utils.auth import get_current_user
from app.database.mongo import get_database
from app.utils.onboarding import calculate_completion
from bson import ObjectId

router = APIRouter()

class ProfileUpdate(BaseModel):
    full_name: str = None
    avatar_url: str = None

@router.get("/")
async def get_profile(current_user: dict = Depends(get_current_user)):
    db = await get_database()
    user_id = current_user["id"]
    
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return None
    
    completion = await calculate_completion(user_id)
    
    profile_completion = 0
    if user.get("full_name"):
        profile_completion += 25
    if user.get("student_id"):
        profile_completion += 25
    if user.get("avatar_url"):
        profile_completion += 25
    if user.get("email"):
        profile_completion += 25
    
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "full_name": user.get("full_name"),
        "student_id": user.get("student_id"),
        "avatar_url": user.get("avatar_url"),
        "role": user.get("role"),
        "created_at": user.get("created_at"),
        "profile_completion": profile_completion,
        "onboarding_completion": completion["total_completion"]
    }

@router.put("/")
async def update_profile(
    profile_data: ProfileUpdate,
    current_user: dict = Depends(get_current_user)
):
    db = await get_database()
    user_id = current_user["id"]
    
    update_data = {}
    if profile_data.full_name is not None:
        update_data["full_name"] = profile_data.full_name
    if profile_data.avatar_url is not None:
        update_data["avatar_url"] = profile_data.avatar_url
    
    if update_data:
        await db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
    
    # Get updated user
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    user["id"] = str(user["_id"])
    
    return {"message": "Profile updated successfully", "user": user}
