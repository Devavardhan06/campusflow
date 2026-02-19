from fastapi import APIRouter, Depends, HTTPException, status
from app.utils.auth import get_current_user
from app.models.fee import FeePayment
from app.database.mongo import get_database
from bson import ObjectId
from datetime import datetime
import uuid

router = APIRouter()

FEE_STRUCTURE = [
    {"name": "Tuition Fee", "amount": 35000, "description": "Academic semester fees"},
    {"name": "Hostel Fee", "amount": 12000, "description": "Accommodation charges"},
    {"name": "Lab Fee", "amount": 2500, "description": "Laboratory and practical fees"},
    {"name": "Library Fee", "amount": 500, "description": "Library membership"},
    {"name": "Sports & Activities", "amount": 1000, "description": "Sports facility and extracurricular"},
]

@router.get("/")
async def get_fee_status(current_user: dict = Depends(get_current_user)):
    db = await get_database()
    user_id = current_user["id"]
    
    fee = await db.fees.find_one({"user_id": user_id})
    if not fee:
        total = sum(item["amount"] for item in FEE_STRUCTURE)
        fee = {
            "user_id": user_id,
            "total_amount": total,
            "paid_amount": 0.0,
            "remaining_amount": total,
            "fee_structure": FEE_STRUCTURE,
            "description": "Semester fees breakdown",
            "transactions": [],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        await db.fees.insert_one(fee)
    else:
        if not fee.get("fee_structure"):
            fee["fee_structure"] = FEE_STRUCTURE
    
    fee["id"] = str(fee["_id"])
    fee["is_paid"] = fee.get("remaining_amount", 0) <= 0
    fee["paid_percentage"] = round((fee.get("paid_amount", 0) / fee.get("total_amount", 1)) * 100, 1)
    return fee

@router.post("/pay")
async def make_payment(
    payment_data: FeePayment,
    current_user: dict = Depends(get_current_user)
):
    db = await get_database()
    user_id = current_user["id"]
    
    fee = await db.fees.find_one({"user_id": user_id})
    if not fee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Fee record not found"
        )
    
    if payment_data.amount > fee["remaining_amount"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment amount exceeds remaining balance"
        )
    
    # Create transaction
    transaction = {
        "id": str(uuid.uuid4()),
        "amount": payment_data.amount,
        "payment_method": payment_data.payment_method,
        "transaction_id": f"TXN{datetime.utcnow().strftime('%Y%m%d%H%M%S')}{uuid.uuid4().hex[:8].upper()}",
        "status": "completed",
        "created_at": datetime.utcnow()
    }
    
    # Update fee
    new_paid = fee["paid_amount"] + payment_data.amount
    new_remaining = fee["total_amount"] - new_paid
    
    await db.fees.update_one(
        {"user_id": user_id},
        {
            "$set": {
                "paid_amount": new_paid,
                "remaining_amount": new_remaining,
                "updated_at": datetime.utcnow()
            },
            "$push": {"transactions": transaction}
        }
    )
    
    # Create notification
    from app.services.notification_service import create_notification
    from app.models.notification import NotificationCreate, NotificationType
    await create_notification(NotificationCreate(
        user_id=user_id,
        title="Payment Received",
        message=f"Payment of ₹{payment_data.amount} has been received successfully.",
        notification_type=NotificationType.TASK_COMPLETION,
        link="/fees"
    ))
    
    return {
        "message": "Payment successful",
        "transaction": transaction,
        "remaining_amount": new_remaining
    }

@router.get("/transactions")
async def get_transactions(current_user: dict = Depends(get_current_user)):
    db = await get_database()
    user_id = current_user["id"]
    
    fee = await db.fees.find_one({"user_id": user_id})
    if not fee:
        return {"transactions": []}
    
    return {"transactions": fee.get("transactions", [])}
