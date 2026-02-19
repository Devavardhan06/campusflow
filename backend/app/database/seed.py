"""Auto-seed courses and hostels if collections are empty"""
from datetime import datetime
from app.database.mongo import get_database

COURSES = [
    {"course_code": "CS101", "course_name": "Introduction to Computer Science", "credits": 3, "description": "Fundamentals of programming"},
    {"course_code": "CS201", "course_name": "Data Structures and Algorithms", "credits": 4, "description": "Advanced data structures"},
    {"course_code": "CS301", "course_name": "Database Systems", "credits": 3, "description": "Database design and SQL"},
    {"course_code": "CS401", "course_name": "Web Development", "credits": 4, "description": "Full-stack web development"},
    {"course_code": "MATH101", "course_name": "Calculus I", "credits": 3, "description": "Differential and integral calculus"},
]

HOSTELS = [
    {"name": "North Hostel", "capacity": 200, "available_rooms": 150},
    {"name": "South Hostel", "capacity": 180, "available_rooms": 120},
    {"name": "East Hostel", "capacity": 150, "available_rooms": 100},
    {"name": "West Hostel", "capacity": 160, "available_rooms": 110},
]

async def seed_if_empty():
    db = await get_database()
    courses_count = await db.courses.count_documents({})
    hostels_count = await db.hostels.count_documents({})

    if courses_count == 0:
        for c in COURSES:
            c["created_at"] = datetime.utcnow()
        await db.courses.insert_many(COURSES)
        print("Seeded courses")

    if hostels_count == 0:
        for h in HOSTELS:
            h["created_at"] = datetime.utcnow()
        await db.hostels.insert_many(HOSTELS)
        print("Seeded hostels")
