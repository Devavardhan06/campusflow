from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class Transaction(BaseModel):
    id: str
    amount: float
    payment_method: str
    transaction_id: str
    status: str
    created_at: datetime

class FeePayment(BaseModel):
    amount: float
    payment_method: str = "online"

class FeeCreate(BaseModel):
    total_amount: float
    description: Optional[str] = None

class Fee(BaseModel):
    id: str
    user_id: str
    total_amount: float
    paid_amount: float
    remaining_amount: float
    description: Optional[str]
    transactions: List[Transaction]
    created_at: datetime
    updated_at: datetime
