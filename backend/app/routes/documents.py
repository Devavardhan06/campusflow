from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from app.utils.auth import get_current_user, get_current_admin
from app.utils.mongo import mongo_to_dict
from app.models.document import DocumentCreate, DocumentStatus
from app.database.mongo import get_database
from bson import ObjectId
from datetime import datetime
from pathlib import Path
import os
import uuid

UPLOADS_PATH = Path(__file__).parent.parent.parent / "uploads"
ALLOWED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"}

router = APIRouter()

REQUIRED_DOCUMENTS = [
    {"type": "id_proof", "label": "ID Proof", "description": "Aadhar Card, Passport or Voter ID"},
    {"type": "address_proof", "label": "Address Proof", "description": "Utility bill or rental agreement"},
    {"type": "academic_transcript", "label": "Academic Transcript", "description": "Latest mark sheet or degree certificate"},
    {"type": "medical_certificate", "label": "Medical Certificate", "description": "Fitness certificate from registered doctor"},
    {"type": "photo", "label": "Passport Photo", "description": "Recent passport-size photograph"},
]

@router.get("/")
async def get_documents(current_user: dict = Depends(get_current_user)):
    db = await get_database()
    user_id = current_user["id"]
    
    cursor = db.documents.find({"user_id": user_id})
    user_docs = {}
    async for doc in cursor:
        doc_dict = mongo_to_dict(doc)
        user_docs[doc_dict["document_type"]] = doc_dict
    
    # Merge with required list - ensure all required docs are present
    documents = []
    for req in REQUIRED_DOCUMENTS:
        doc = user_docs.get(req["type"])
        if doc:
            doc["label"] = req["label"]
            doc["description"] = req["description"]
            documents.append(doc)
        else:
            documents.append({
                "id": None,
                "document_type": req["type"],
                "label": req["label"],
                "description": req["description"],
                "file_url": None,
                "status": "pending",
                "verified_at": None,
            })
    
    completed = sum(1 for d in documents if d.get("status") == "verified")
    total = len(documents)
    
    return {
        "documents": documents,
        "required_documents": REQUIRED_DOCUMENTS,
        "stats": {"completed": completed, "total": total, "percentage": round((completed / total) * 100, 1) if total else 0}
    }

@router.post("/upload")
async def upload_document(
    document_data: DocumentCreate,
    current_user: dict = Depends(get_current_user)
):
    """Upload by URL (for backward compatibility)"""
    db = await get_database()
    user_id = current_user["id"]
    file_url = document_data.file_url or f"/uploads/placeholder_{document_data.document_type.value}.pdf"
    
    result = await db.documents.update_one(
        {
            "user_id": user_id,
            "document_type": document_data.document_type.value
        },
        {
            "$set": {
                "file_url": file_url,
                "status": DocumentStatus.UPLOADED.value,
                "updated_at": datetime.utcnow()
            }
        },
        upsert=True
    )
    
    if result.upserted_id:
        doc_id = str(result.upserted_id)
    else:
        doc = await db.documents.find_one({
            "user_id": user_id,
            "document_type": document_data.document_type.value
        })
        doc_id = str(doc["_id"])
    
    # Create notification
    from app.services.notification_service import create_notification
    from app.models.notification import NotificationType
    await create_notification({
        "user_id": user_id,
        "title": "Document Uploaded",
        "message": f"Your {document_data.document_type.value.replace('_', ' ')} has been uploaded successfully.",
        "notification_type": NotificationType.TASK_COMPLETION,
        "link": "/documents"
    })
    
    return {"message": "Document uploaded successfully", "document_id": doc_id}


@router.post("/upload-file")
async def upload_document_file(
    document_type: str = Form(...),
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Upload document file (multipart/form-data)"""
    db = await get_database()
    user_id = current_user["id"]
    
    # Validate document type
    valid_types = [r["type"] for r in REQUIRED_DOCUMENTS]
    if document_type not in valid_types:
        raise HTTPException(status_code=400, detail=f"Invalid document type. Allowed: {valid_types}")
    
    # Validate file extension
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Use: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Create user uploads folder
    user_uploads = UPLOADS_PATH / user_id
    user_uploads.mkdir(parents=True, exist_ok=True)
    
    # Generate unique filename
    safe_name = f"{document_type}_{uuid.uuid4().hex[:8]}{ext}"
    file_path = user_uploads / safe_name
    
    # Save file
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)
    
    # File URL (relative to backend)
    file_url = f"/uploads/{user_id}/{safe_name}"
    
    # Update or create document record
    await db.documents.update_one(
        {"user_id": user_id, "document_type": document_type},
        {
            "$set": {
                "file_url": file_url,
                "status": DocumentStatus.UPLOADED.value,
                "updated_at": datetime.utcnow(),
                "file_name": file.filename
            }
        },
        upsert=True
    )
    
    # Create notification
    from app.services.notification_service import create_notification
    from app.models.notification import NotificationCreate, NotificationType
    await create_notification(NotificationCreate(
        user_id=user_id,
        title="Document Uploaded",
        message=f"Your {document_type.replace('_', ' ')} has been uploaded successfully.",
        notification_type=NotificationType.TASK_COMPLETION,
        link="/documents"
    ))
    
    return {"message": "Document uploaded successfully", "file_url": file_url}


@router.put("/{document_id}/verify")
async def verify_document(
    document_id: str,
    current_admin: dict = Depends(get_current_admin)
):
    db = await get_database()
    
    result = await db.documents.update_one(
        {"_id": ObjectId(document_id)},
        {
            "$set": {
                "status": DocumentStatus.VERIFIED.value,
                "verified_by": current_admin["id"],
                "verified_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    # Get document to create notification
    doc = await db.documents.find_one({"_id": ObjectId(document_id)})
    
    # Create notification
    from app.services.notification_service import create_notification
    from app.models.notification import NotificationType
    await create_notification({
        "user_id": doc["user_id"],
        "title": "Document Verified",
        "message": f"Your {doc['document_type'].replace('_', ' ')} has been verified.",
        "notification_type": NotificationType.TASK_COMPLETION,
        "link": "/documents"
    })
    
    return {"message": "Document verified successfully"}
