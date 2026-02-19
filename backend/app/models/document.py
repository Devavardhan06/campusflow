from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

class DocumentStatus(str, Enum):
    PENDING = "pending"
    UPLOADED = "uploaded"
    VERIFIED = "verified"

class DocumentType(str, Enum):
    ID_PROOF = "id_proof"
    ADDRESS_PROOF = "address_proof"
    ACADEMIC_TRANSCRIPT = "academic_transcript"
    MEDICAL_CERTIFICATE = "medical_certificate"
    PHOTO = "photo"

class DocumentCreate(BaseModel):
    document_type: DocumentType
    file_url: Optional[str] = None

class DocumentUpdate(BaseModel):
    status: Optional[DocumentStatus] = None
    file_url: Optional[str] = None

class Document(BaseModel):
    id: str
    user_id: str
    document_type: DocumentType
    file_url: Optional[str]
    status: DocumentStatus
    verified_by: Optional[str]
    verified_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime
