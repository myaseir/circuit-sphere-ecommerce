import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def test():
    MONGO_URI = "mongodb+srv://admin:lXg8rmRIqdBX1e0t@cluster0.irdtn5u.mongodb.net/your_db_name?retryWrites=true&w=majority"
    client = AsyncIOMotorClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    try:
        db = client.get_database("electronics_store")
        result = await db.command("ping")
        print("Connected successfully:", result)
    except Exception as e:
        print("Failed:", e)

asyncio.run(test())
