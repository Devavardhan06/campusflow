from typing import Dict, List, Optional
from app.database.mongo import get_database
from bson import ObjectId

async def calculate_completion(user_id: str) -> Dict:
    """Calculate onboarding completion percentage"""
    db = await get_database()
    
    # Documents (25%)
    total_docs = 5  # id_proof, address_proof, academic_transcript, medical_certificate, photo
    verified_docs = await db.documents.count_documents({
        "user_id": user_id,
        "status": "verified"
    })
    documents_score = (verified_docs / total_docs) * 25 if total_docs > 0 else 0
    
    # Fees (25%)
    fee = await db.fees.find_one({"user_id": user_id})
    fees_score = 0
    if fee:
        if fee.get("total_amount", 0) > 0:
            fees_score = (fee.get("paid_amount", 0) / fee.get("total_amount", 1)) * 25
    
    # Courses (25%)
    registered_courses = await db.student_courses.count_documents({"user_id": user_id})
    courses_score = min(registered_courses * 5, 25)  # 5 courses = 25%
    
    # Hostel (25%)
    hostel_app = await db.hostel_applications.find_one({"user_id": user_id})
    hostel_score = 0
    if hostel_app:
        if hostel_app.get("status") == "allocated":
            hostel_score = 25
        elif hostel_app.get("status") == "pending":
            hostel_score = 10
    
    total_completion = documents_score + fees_score + courses_score + hostel_score
    
    return {
        "total_completion": round(total_completion, 2),
        "documents": round(documents_score, 2),
        "fees": round(fees_score, 2),
        "courses": round(courses_score, 2),
        "hostel": round(hostel_score, 2)
    }

async def calculate_health_score(user_id: str) -> int:
    """Calculate health score (100 - missing sections * 25)"""
    completion = await calculate_completion(user_id)
    sections_complete = sum([
        1 if completion["documents"] >= 25 else 0,
        1 if completion["fees"] >= 25 else 0,
        1 if completion["courses"] >= 25 else 0,
        1 if completion["hostel"] >= 25 else 0
    ])
    missing_sections = 4 - sections_complete
    health_score = 100 - (missing_sections * 25)
    return max(0, health_score)

async def detect_risk(user_id: str) -> Dict:
    """Detect risk level based on onboarding status"""
    db = await get_database()
    
    fee = await db.fees.find_one({"user_id": user_id})
    fee_percentage = 0
    if fee and fee.get("total_amount", 0) > 0:
        fee_percentage = (fee.get("paid_amount", 0) / fee.get("total_amount", 1)) * 100
    
    pending_docs = await db.documents.count_documents({
        "user_id": user_id,
        "status": {"$in": ["pending", "uploaded"]}
    })
    
    if fee_percentage < 50 and pending_docs > 0:
        return {"level": "HIGH", "message": "Fee payment incomplete and documents pending"}
    elif fee_percentage < 50 or pending_docs > 2:
        return {"level": "MEDIUM", "message": "One or more sections incomplete"}
    else:
        return {"level": "LOW", "message": "Onboarding progressing well"}

async def get_next_best_action(user_id: str) -> Dict:
    """Get the next best action for the student"""
    completion = await calculate_completion(user_id)
    
    if completion["documents"] < 25:
        return {
            "section": "documents",
            "action": "Upload required documents",
            "priority": "high"
        }
    elif completion["fees"] < 25:
        return {
            "section": "fees",
            "action": "Complete fee payment",
            "priority": "high"
        }
    elif completion["courses"] < 25:
        return {
            "section": "courses",
            "action": "Register for courses",
            "priority": "medium"
        }
    elif completion["hostel"] < 25:
        return {
            "section": "hostel",
            "action": "Apply for hostel accommodation",
            "priority": "medium"
        }
    else:
        return {
            "section": "complete",
            "action": "All onboarding steps completed!",
            "priority": "low"
        }
