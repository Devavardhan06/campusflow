from fastapi import APIRouter, Depends
from app.utils.auth import get_current_admin
from app.utils.onboarding import calculate_completion, detect_risk
from app.database.mongo import get_database
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/dashboard")
async def get_admin_dashboard(current_admin: dict = Depends(get_current_admin)):
    db = await get_database()
    
    # Total students
    total_students = await db.users.count_documents({"role": "student"})
    
    # Calculate completion rates
    cursor = db.users.find({"role": "student"})
    completions = []
    risk_students = []
    
    async for user in cursor:
        user_id = str(user["_id"])
        completion = await calculate_completion(user_id)
        risk = await detect_risk(user_id)
        
        completions.append(completion["total_completion"])
        
        if risk["level"] in ["HIGH", "MEDIUM"]:
            risk_students.append({
                "id": user_id,
                "name": user.get("full_name"),
                "email": user.get("email"),
                "completion": completion["total_completion"],
                "risk": risk
            })
    
    avg_completion = sum(completions) / len(completions) if completions else 0
    
    # Section-wise metrics
    section_metrics = {
        "documents": {"complete": 0, "pending": 0},
        "fees": {"complete": 0, "pending": 0},
        "courses": {"complete": 0, "pending": 0},
        "hostel": {"complete": 0, "pending": 0}
    }
    
    async for user in db.users.find({"role": "student"}):
        user_id = str(user["_id"])
        completion = await calculate_completion(user_id)
        
        if completion["documents"] >= 25:
            section_metrics["documents"]["complete"] += 1
        else:
            section_metrics["documents"]["pending"] += 1
        
        if completion["fees"] >= 25:
            section_metrics["fees"]["complete"] += 1
        else:
            section_metrics["fees"]["pending"] += 1
        
        if completion["courses"] >= 25:
            section_metrics["courses"]["complete"] += 1
        else:
            section_metrics["courses"]["pending"] += 1
        
        if completion["hostel"] >= 25:
            section_metrics["hostel"]["complete"] += 1
        else:
            section_metrics["hostel"]["pending"] += 1
    
    return {
        "total_students": total_students,
        "average_completion": round(avg_completion, 2),
        "risk_students": risk_students[:10],  # Top 10
        "section_metrics": section_metrics,
        "chart_data": {
            "labels": ["Documents", "Fees", "Courses", "Hostel"],
            "complete": [
                section_metrics["documents"]["complete"],
                section_metrics["fees"]["complete"],
                section_metrics["courses"]["complete"],
                section_metrics["hostel"]["complete"]
            ],
            "pending": [
                section_metrics["documents"]["pending"],
                section_metrics["fees"]["pending"],
                section_metrics["courses"]["pending"],
                section_metrics["hostel"]["pending"]
            ]
        }
    }

@router.get("/students")
async def get_all_students(current_admin: dict = Depends(get_current_admin)):
    db = await get_database()
    
    cursor = db.users.find({"role": "student"})
    students = []
    
    async for user in cursor:
        user_id = str(user["_id"])
        completion = await calculate_completion(user_id)
        risk = await detect_risk(user_id)
        
        students.append({
            "id": user_id,
            "name": user.get("full_name"),
            "email": user.get("email"),
            "student_id": user.get("student_id"),
            "completion": completion["total_completion"],
            "health_score": 100 - (4 - sum([
                1 if completion["documents"] >= 25 else 0,
                1 if completion["fees"] >= 25 else 0,
                1 if completion["courses"] >= 25 else 0,
                1 if completion["hostel"] >= 25 else 0
            ])) * 25,
            "risk": risk
        })
    
    return {"students": students}
