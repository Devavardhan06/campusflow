from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "campusflow")

client = None
database = None

async def init_db():
    global client, database
    client = AsyncIOMotorClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    database = client[DATABASE_NAME]
    try:
        await client.admin.command("ping")
        print(f"Connected to MongoDB: {DATABASE_NAME}")
    except Exception as e:
        print(
            f"ERROR: Could not connect to MongoDB. "
            f"Set MONGO_URI in .env to your MongoDB Atlas connection string, "
            f"or start a local MongoDB. Details: {e}"
        )
        raise

async def get_database():
    return database

async def close_db():
    global client
    if client:
        client.close()
