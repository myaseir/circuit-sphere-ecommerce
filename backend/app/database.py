from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from typing import Optional
import logging
from datetime import datetime

from app.core.config import settings
from app.core.exceptions import DatabaseException

logger = logging.getLogger(__name__)

class Database:
    """Database connection manager"""
    
    client= None
    db = None
    
    @classmethod
    async def connect_to_mongo(cls):
        """Connect to MongoDB"""
        try:
            cls.client = AsyncIOMotorClient(
                settings.MONGO_URI,
                maxPoolSize=10,
                minPoolSize=1
            )
            cls.db = cls.client["electronics_store"]
            
            # Test connection
            await cls.db.command("ping")
            logger.info(f"Connected to MongoDB: {'electronics_store'}")

            
            # Create indexes
            await cls.create_indexes()
            
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            raise DatabaseException("connect", {"error": str(e)})
    
    @classmethod
    async def create_indexes(cls):
        """Create database indexes for performance"""
        try:
            # ---------------------------------------------------------
            # 1. KITS Collection (No changes needed here)
            # ---------------------------------------------------------
            await cls.db.kits.create_index("name")
            await cls.db.kits.create_index("category")
            await cls.db.kits.create_index([("name", "text"), ("description", "text")])
            await cls.db.kits.create_index("is_active")
            
            # ---------------------------------------------------------
            # 2. ORDERS Collection (UPDATED)
            # ---------------------------------------------------------
            
            # OLD: await cls.db.orders.create_index("customer_email")
            # NEW: Use dot notation to reach inside the 'customer' object
            await cls.db.orders.create_index("customer.email")
            
            # Status and Date are still at the root level, so these are fine
            await cls.db.orders.create_index("status")
            await cls.db.orders.create_index("created_at")
            
            # OLD: await cls.db.orders.create_index([("kit_id", 1), ("created_at", -1)])
            # NEW: Index inside the 'items' array. MongoDB automatically creates 
            # a "Multikey Index" here, allowing you to search for orders 
            # containing a specific product ID.
            await cls.db.orders.create_index([("items.id", 1), ("created_at", -1)])
            
            logger.info("Database indexes created successfully")
        except Exception as e:
            logger.warning(f"Could not create indexes: {e}")
    
    @classmethod
    async def close_mongo_connection(cls):
        """Close MongoDB connection"""
        if cls.client:
            cls.client.close()
            logger.info("MongoDB connection closed")
    
    @classmethod
    def get_collection(cls, collection_name: str):
        """Get collection from database"""
        if cls.db is None:
            raise DatabaseException("get_collection", {"error": "Database not connected"})
        return cls.db[collection_name]

# Create global database instance
db = Database()

# Alias functions for easier import
connect_to_mongo = db.connect_to_mongo
close_mongo_connection = db.close_mongo_connection
get_collection = db.get_collection