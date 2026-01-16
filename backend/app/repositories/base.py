from typing import Dict, Any, List, Optional, TypeVar, Generic
from bson import ObjectId
from pydantic import BaseModel
import logging
from datetime import datetime

from app.core.exceptions import NotFoundException, DatabaseException
from app.database import get_collection

logger = logging.getLogger(__name__)

T = TypeVar('T', bound=BaseModel)

class BaseRepository(Generic[T]):
    """Base repository with common CRUD operations"""
    
    def __init__(self, collection_name: str, model_class: type):
        self.collection = get_collection(collection_name)
        self.model_class = model_class
    
    async def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new document"""
        try:
            result = await self.collection.insert_one(data)
            created = await self.collection.find_one({"_id": result.inserted_id})
            return self._to_dict(created)
        except Exception as e:
            logger.error(f"Create operation failed: {e}")
            raise DatabaseException("create", {"error": str(e)})
    
    async def find_by_id(self, id: str) -> Dict[str, Any]:
        """Find document by ID"""
        try:
            if not ObjectId.is_valid(id):
                raise NotFoundException(self.collection.name, id)
            
            document = await self.collection.find_one({"_id": ObjectId(id)})
            if not document:
                raise NotFoundException(self.collection.name, id)
            
            return self._to_dict(document)
        except NotFoundException:
            raise
        except Exception as e:
            logger.error(f"Find by ID operation failed: {e}")
            raise DatabaseException("find_by_id", {"error": str(e)})
    
    async def find_all(
        self, 
        skip: int = 0, 
        limit: int = 100,
        filter_query: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """Find all documents with pagination"""
        try:
            filter_query = filter_query or {}
            cursor = self.collection.find(filter_query).skip(skip).limit(limit)
            items = []
            async for document in cursor:
                items.append(self._to_dict(document))
            return items
        except Exception as e:
            logger.error(f"Find all operation failed: {e}")
            raise DatabaseException("find_all", {"error": str(e)})
    
    async def update(self, id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Update document by ID"""
        try:
            if not ObjectId.is_valid(id):
                raise NotFoundException(self.collection.name, id)
            
            data["updated_at"] = datetime.utcnow()
            result = await self.collection.update_one(
                {"_id": ObjectId(id)},
                {"$set": data}
            )
            
            if result.matched_count == 0:
                raise NotFoundException(self.collection.name, id)
            
            updated = await self.collection.find_one({"_id": ObjectId(id)})
            return self._to_dict(updated)
        except NotFoundException:
            raise
        except Exception as e:
            logger.error(f"Update operation failed: {e}")
            raise DatabaseException("update", {"error": str(e)})
    
    async def delete(self, id: str) -> bool:
        """Delete document by ID"""
        try:
            if not ObjectId.is_valid(id):
                raise NotFoundException(self.collection.name, id)
            
            result = await self.collection.delete_one({"_id": ObjectId(id)})
            return result.deleted_count > 0
        except Exception as e:
            logger.error(f"Delete operation failed: {e}")
            raise DatabaseException("delete", {"error": str(e)})
    
    async def count(self, filter_query: Optional[Dict[str, Any]] = None) -> int:
        """Count documents"""
        try:
            filter_query = filter_query or {}
            return await self.collection.count_documents(filter_query)
        except Exception as e:
            logger.error(f"Count operation failed: {e}")
            raise DatabaseException("count", {"error": str(e)})
    
    def _to_dict(self, document: Dict[str, Any]) -> Dict[str, Any]:
        """Convert MongoDB document to dictionary"""
        if not document:
            return {}
        
        doc_dict = dict(document)
        doc_dict["id"] = str(doc_dict.pop("_id", None))
        return doc_dict