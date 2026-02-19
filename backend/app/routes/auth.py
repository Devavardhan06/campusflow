from fastapi import APIRouter, HTTPException, status, Depends
from app.models.user import UserCreate, UserLogin, UserResponse
from app.utils.auth import hash_password, verify_password, create_access_token, get_current_user
from app.database.mongo import get_database
from datetime import timedelta
from bson import ObjectId

router = APIRouter()

@router.post("/register", response_model=dict)
async def register(user_data: UserCreate):
    db = await get_database()
    
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user
    from datetime import datetime
    user_dict = {
        "email": user_data.email,
        "full_name": user_data.full_name,
        "student_id": user_data.student_id,
        "role": user_data.role.value,
        "password_hash": hash_password(user_data.password),
        "avatar_url": None,
        "created_at": datetime.utcnow()
    }
    
    result = await db.users.insert_one(user_dict)
    user_id = str(result.inserted_id)
    
    # Create initial fee record with structure
    fee_structure = [
        {"name": "Tuition Fee", "amount": 35000, "description": "Academic semester fees"},
        {"name": "Hostel Fee", "amount": 12000, "description": "Accommodation charges"},
        {"name": "Lab Fee", "amount": 2500, "description": "Laboratory and practical fees"},
        {"name": "Library Fee", "amount": 500, "description": "Library membership"},
        {"name": "Sports & Activities", "amount": 1000, "description": "Sports facility and extracurricular"},
    ]
    total_fee = sum(f["amount"] for f in fee_structure)
    await db.fees.insert_one({
        "user_id": user_id,
        "total_amount": total_fee,
        "paid_amount": 0.0,
        "remaining_amount": total_fee,
        "fee_structure": fee_structure,
        "description": "Semester fees breakdown",
        "transactions": [],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    })
    
    # Create initial documents
    from app.models.document import DocumentType, DocumentStatus
    required_docs = [
        DocumentType.ID_PROOF,
        DocumentType.ADDRESS_PROOF,
        DocumentType.ACADEMIC_TRANSCRIPT,
        DocumentType.MEDICAL_CERTIFICATE,
        DocumentType.PHOTO
    ]
    
    for doc_type in required_docs:
        await db.documents.insert_one({
            "user_id": user_id,
            "document_type": doc_type.value,
            "file_url": None,
            "status": DocumentStatus.PENDING.value,
            "verified_by": None,
            "verified_at": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        })
    
    # Create access token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user_id, "role": user_data.role.value},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "email": user_data.email,
            "full_name": user_data.full_name,
            "student_id": user_data.student_id,
            "role": user_data.role.value
        }
    }

@router.post("/login", response_model=dict)
async def login(credentials: UserLogin):
    db = await get_database()
    
    user = await db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": str(user["_id"]), "role": user["role"]},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "email": user["email"],
            "full_name": user["full_name"],
            "student_id": user.get("student_id"),
            "role": user["role"]
        }
    }

@router.get("/me", response_model=dict)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user["id"],
        "email": current_user["email"],
        "full_name": current_user["full_name"],
        "student_id": current_user.get("student_id"),
        "role": current_user["role"],
        "avatar_url": current_user.get("avatar_url")
    }
