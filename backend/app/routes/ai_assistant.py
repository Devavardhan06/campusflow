from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.utils.auth import get_current_user
from app.utils.mongo import mongo_to_dict
from app.utils.onboarding import calculate_completion, detect_risk, get_next_best_action
from app.database.mongo import get_database
from datetime import datetime

router = APIRouter()

class ChatMessage(BaseModel):
    question: str

class ChatResponse(BaseModel):
    answer: str
    suggestions: list = []

@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(
    message: ChatMessage,
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["id"]
    db = await get_database()
    
    # Get student onboarding status
    completion = await calculate_completion(user_id)
    risk = await detect_risk(user_id)
    next_action = await get_next_best_action(user_id)
    
    # Get user details
    from bson import ObjectId
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    
    # Get recent status
    fee = await db.fees.find_one({"user_id": user_id})
    fee_status = ""
    if fee:
        fee_percentage = (fee.get("paid_amount", 0) / fee.get("total_amount", 1)) * 100 if fee.get("total_amount", 0) > 0 else 0
        fee_status = f"Fee Payment: {fee_percentage:.1f}% completed (₹{fee.get('paid_amount', 0)}/₹{fee.get('total_amount', 0)})"
    
    pending_docs = await db.documents.count_documents({
        "user_id": user_id,
        "status": {"$in": ["pending", "uploaded"]}
    })
    
    registered_courses = await db.student_courses.count_documents({"user_id": user_id})
    
    hostel_app = await db.hostel_applications.find_one({"user_id": user_id})
    hostel_status = "Not applied" if not hostel_app else hostel_app.get("status", "pending")
    
    # Build context prompt
    context = f"""
Student: {user.get('full_name', 'Student')}
Student ID: {user.get('student_id', 'N/A')}
Onboarding Completion: {completion['total_completion']:.1f}%
Health Score: {100 - (4 - sum([1 if completion['documents'] >= 25 else 0, 1 if completion['fees'] >= 25 else 0, 1 if completion['courses'] >= 25 else 0, 1 if completion['hostel'] >= 25 else 0])) * 25}
Risk Level: {risk['level']}

Current Status:
- Documents: {completion['documents']:.1f}% ({pending_docs} pending)
- {fee_status}
- Courses: {registered_courses} registered ({completion['courses']:.1f}%)
- Hostel: {hostel_status} ({completion['hostel']:.1f}%)

Next Best Action: {next_action['action']}
"""
    
    # Store conversation history
    conversation = {
        "user_id": user_id,
        "question": message.question,
        "context": context,
        "created_at": datetime.utcnow()
    }
    await db.conversations.insert_one(conversation)
    
    # Generate intelligent response (simplified - in production, use actual AI API)
    question_lower = message.question.lower()
    
    if any(word in question_lower for word in ["document", "upload", "file"]):
        answer = f"Based on your current status, you have {pending_docs} pending documents. Please upload the required documents to complete this section. Your document completion is currently at {completion['documents']:.1f}%."
        suggestions = ["Upload ID Proof", "Upload Address Proof", "Upload Academic Transcript"]
    
    elif any(word in question_lower for word in ["fee", "payment", "pay", "balance"]):
        if fee:
            answer = f"Your fee payment status: ₹{fee.get('paid_amount', 0)} paid out of ₹{fee.get('total_amount', 0)} total. Remaining balance: ₹{fee.get('remaining_amount', 0)}. You need to complete at least 50% payment to register for courses."
            suggestions = ["Make Payment", "View Transaction History"]
        else:
            answer = "Fee information not available. Please contact administration."
            suggestions = []
    
    elif any(word in question_lower for word in ["course", "register", "lms"]):
        answer = f"You have registered for {registered_courses} course(s). Course completion is at {completion['courses']:.1f}%. Remember, you need at least 50% fee payment to register for courses."
        suggestions = ["Browse Courses", "Register for More Courses"]
    
    elif any(word in question_lower for word in ["hostel", "accommodation", "room", "mess"]):
        if hostel_app:
            if hostel_app.get("status") == "allocated":
                answer = f"Your hostel application status: {hostel_app.get('status', 'pending')}. Hostel: {hostel_app.get('allocated_hostel', 'N/A')}, Room: {hostel_app.get('allocated_room', 'N/A')}. Mess registration: {hostel_app.get('mess_registration', 'not_registered')}."
                suggestions = ["Register for Mess" if hostel_app.get('mess_registration') != 'registered' else "View Hostel Details"]
            else:
                answer = f"Your hostel application is currently {hostel_app.get('status', 'pending')}. Please wait for allocation."
                suggestions = []
        else:
            answer = "You haven't applied for hostel accommodation yet. Please submit your hostel application with your preferences."
            suggestions = ["Apply for Hostel"]
    
    elif any(word in question_lower for word in ["status", "progress", "completion", "how am i"]):
        answer = f"Your overall onboarding completion is {completion['total_completion']:.1f}%. Here's the breakdown:\n- Documents: {completion['documents']:.1f}%\n- Fees: {completion['fees']:.1f}%\n- Courses: {completion['courses']:.1f}%\n- Hostel: {completion['hostel']:.1f}%\n\nRisk Level: {risk['level']}\nNext Action: {next_action['action']}"
        suggestions = ["View Dashboard", "Complete Pending Tasks"]
    
    else:
        answer = f"Thank you for your question. Based on your current onboarding status ({completion['total_completion']:.1f}% complete), I recommend focusing on: {next_action['action']}. Your risk level is currently {risk['level']}. How can I help you further?"
        suggestions = ["View Dashboard", "Check Documents", "View Fees", "Browse Courses"]
    
    return ChatResponse(answer=answer, suggestions=suggestions)

@router.get("/history")
async def get_conversation_history(current_user: dict = Depends(get_current_user)):
    db = await get_database()
    user_id = current_user["id"]
    
    cursor = db.conversations.find({"user_id": user_id}).sort("created_at", -1).limit(20)
    conversations = []
    async for conv in cursor:
        conversations.append(mongo_to_dict(conv))
    
    return {"conversations": conversations}
