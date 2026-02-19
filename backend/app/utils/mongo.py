"""Utility functions for MongoDB document serialization"""
from bson import ObjectId
from datetime import datetime, date
from typing import Any, Dict, List


def convert_objectid_to_str(obj: Any) -> Any:
    """Recursively convert ObjectId and datetime objects to strings"""
    if isinstance(obj, ObjectId):
        return str(obj)
    elif isinstance(obj, datetime):
        return obj.isoformat()
    elif isinstance(obj, date):
        return obj.isoformat()
    elif isinstance(obj, dict):
        result = {}
        for key, value in obj.items():
            # Skip _id field, we'll add id separately
            if key == "_id":
                continue
            result[key] = convert_objectid_to_str(value)
        return result
    elif isinstance(obj, list):
        return [convert_objectid_to_str(item) for item in obj]
    else:
        return obj


def mongo_to_dict(doc: Dict) -> Dict:
    """Convert MongoDB document to JSON-serializable dict"""
    if not doc:
        return doc
    
    result = convert_objectid_to_str(doc)
    # Add id field from _id
    if "_id" in doc:
        result["id"] = str(doc["_id"])
    
    return result
