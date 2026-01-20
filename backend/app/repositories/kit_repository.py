from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from bson import ObjectId

from .base import BaseRepository
from app.models.entities import Kit
from app.database import get_collection  # ✅ Needed to access the reviews collection

class KitRepository(BaseRepository[Kit]):
    """Kit repository handles Kits AND Reviews"""
    
    def __init__(self):
        super().__init__("kits", Kit)
        # ✅ We manually grab the reviews collection here
        self.review_collection = get_collection("reviews")
    
    async def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new kit with timestamps and default sale/spec values"""
        # ✅ Ensure defaults for new features if missing
        data.setdefault("on_sale", False)
        data.setdefault("specifications", {})
        data.setdefault("spec_images", [])
        
        # --- NEW: Initialize Rating Fields ---
        data.setdefault("average_rating", 0.0)
        data.setdefault("total_reviews", 0)
        # -------------------------------------
        
        data["created_at"] = datetime.utcnow()
        data["updated_at"] = datetime.utcnow()
        return await super().create(data)
    
    async def find_active_kits(self, skip: int = 0, limit: int = 100) -> List[Dict[str, Any]]:
        """Find all active kits"""
        return await self.find_all(
            skip=skip, 
            limit=limit, 
            filter_query={"is_active": True}
        )
    
    async def update_stock(self, kit_id: str, quantity_change: int) -> Dict[str, Any]:
        """Update kit stock quantity"""
        kit = await self.find_by_id(kit_id)
        if not kit:
            raise ValueError(f"Kit with ID {kit_id} not found")

        new_quantity = kit["stock_quantity"] + quantity_change
        
        if new_quantity < 0:
            raise ValueError("Insufficient stock")
        
        return await self.update(kit_id, {
            "stock_quantity": new_quantity,
            "updated_at": datetime.utcnow()
        })

    # ---------------------------------------------------------
    # Methods for Sale & Specifications
    # ---------------------------------------------------------

    async def toggle_sale_status(self, kit_id: str, on_sale: bool) -> Dict[str, Any]:
        """Enable or disable the sale status for a kit"""
        return await self.update(kit_id, {
            "on_sale": on_sale,
            "updated_at": datetime.utcnow()
        })

    async def update_specs(self, kit_id: str, specifications: Dict[str, str], spec_images: List[str]) -> Dict[str, Any]:
        """Update technical specifications and diagrams specifically"""
        return await self.update(kit_id, {
            "specifications": specifications,
            "spec_images": spec_images,
            "updated_at": datetime.utcnow()
        })

    # ---------------------------------------------------------
    # SEARCH
    # ---------------------------------------------------------
    
    async def search_kits(
        self, 
        query: str,
        category: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        """Search kits by name, description, or category"""
        
        # 1. Base requirement
        filter_query = {"is_active": True}
        
        # 2. Add Text Search
        if query and query.strip():
            filter_query["$or"] = [
                {"name": {"$regex": query, "$options": "i"}},
                {"description": {"$regex": query, "$options": "i"}},
            ]
        
        # 3. Add Category Filter
        if category and category.strip():
            filter_query["category"] = {"$regex": f"^{category}$", "$options": "i"}
        
        return await self.find_all(skip=skip, limit=limit, filter_query=filter_query)

    # ---------------------------------------------------------
    # ✅ NEW: MERGED REVIEW LOGIC
    # ---------------------------------------------------------

    async def add_review(self, review_data: Dict[str, Any]) -> Dict[str, Any]:
        """Insert review -> Calculate Average -> Update Kit"""
        
        # 1. Prepare Data
        review_data["created_at"] = datetime.utcnow()
        
        # ✅ FIX: Explicitly set visible to True
        # Without this, your 'get_reviews' filter excludes the new review!
        review_data["is_visible"] = True  
        
        # 2. Insert into reviews collection
        result = await self.review_collection.insert_one(review_data)
        review_data["id"] = str(result.inserted_id)

        # 3. Update the Kit's aggregate stats (Star count)
        await self._recalculate_kit_rating(review_data["product_id"])
        
        return review_data

    async def get_reviews(self, product_id: str, skip: int = 0, limit: int = 5) -> List[Dict[str, Any]]:
        """Get reviews for a specific kit"""
        cursor = self.review_collection.find(
            {"product_id": product_id, "is_visible": True}
        ).sort("created_at", -1).skip(skip).limit(limit)
        
        reviews = []
        async for doc in cursor:
            doc["id"] = str(doc["_id"])
            reviews.append(doc)
        return reviews

    async def check_review_rate_limit(self, ip_address: str, product_id: str) -> bool:
        """Check if IP has posted on this product in the last 10 mins"""
        ten_mins_ago = datetime.utcnow() - timedelta(minutes=10)
        count = await self.review_collection.count_documents({
            "ip_address": ip_address,
            "product_id": product_id,
            "created_at": {"$gte": ten_mins_ago}
        })
        return count == 0

    async def _recalculate_kit_rating(self, product_id: str):
        """Internal helper to update the Kit's star rating"""
        pipeline = [
            {"$match": {"product_id": product_id, "is_visible": True}},
            {"$group": {
                "_id": "$product_id",
                "average_rating": {"$avg": "$rating"},
                "total_reviews": {"$sum": 1}
            }}
        ]
        
        result = await self.review_collection.aggregate(pipeline).to_list(length=1)
        
        if result:
            stats = result[0]
            avg = round(stats["average_rating"], 1)
            total = stats["total_reviews"]
        else:
            avg = 0.0
            total = 0
            
        # Update the KIT collection directly
        await self.collection.update_one(
            {"_id": ObjectId(product_id)},
            {"$set": {"average_rating": avg, "total_reviews": total}}
        )