"""
Seed script to initialize sample courses and hostels
Run this after starting the backend server
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "campusflow")

async def seed_data():
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DATABASE_NAME]
    
    # Seed courses
    courses = [
        {
            "course_code": "CS101",
            "course_name": "Introduction to Computer Science",
            "credits": 3,
            "description": "Fundamentals of computer science and programming",
            "created_at": datetime.utcnow()
        },
        {
            "course_code": "CS201",
            "course_name": "Data Structures and Algorithms",
            "credits": 4,
            "description": "Advanced data structures and algorithm design",
            "created_at": datetime.utcnow()
        },
        {
            "course_code": "CS301",
            "course_name": "Database Systems",
            "credits": 3,
            "description": "Database design and management",
            "created_at": datetime.utcnow()
        },
        {
            "course_code": "CS401",
            "course_name": "Web Development",
            "credits": 4,
            "description": "Full-stack web development",
            "created_at": datetime.utcnow()
        },
        {
            "course_code": "MATH101",
            "course_name": "Calculus I",
            "credits": 3,
            "description": "Differential and integral calculus",
            "created_at": datetime.utcnow()
        },
    ]
    
    # Clear existing courses (optional)
    await db.courses.delete_many({})
    
    # Insert courses
    result = await db.courses.insert_many(courses)
    print(f"Inserted {len(result.inserted_ids)} courses")
    
    # Seed hostels
    hostels = [
        {
            "name": "North Hostel",
            "capacity": 200,
            "available_rooms": 150,
            "created_at": datetime.utcnow()
        },
        {
            "name": "South Hostel",
            "capacity": 180,
            "available_rooms": 120,
            "created_at": datetime.utcnow()
        },
        {
            "name": "East Hostel",
            "capacity": 150,
            "available_rooms": 100,
            "created_at": datetime.utcnow()
        },
        {
            "name": "West Hostel",
            "capacity": 160,
            "available_rooms": 110,
            "created_at": datetime.utcnow()
        },
    ]
    
    # Clear existing hostels (optional)
    await db.hostels.delete_many({})
    
    # Insert hostels
    result = await db.hostels.insert_many(hostels)
    print(f"Inserted {len(result.inserted_ids)} hostels")
    
    print("Seed data initialization complete!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_data())
