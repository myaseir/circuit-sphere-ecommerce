from typing import List, Dict, Any, Optional
from datetime import datetime

from .base import BaseRepository
from app.models.entities import Kit

class KitRepository(BaseRepository[Kit]):
    """Kit repository for data access operations"""
    
    def __init__(self):
        super().__init__("kits", Kit)
    
    async def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new kit with timestamps and default sale/spec values"""
        # ✅ Ensure defaults for new features if missing
        data.setdefault("on_sale", False)
        data.setdefault("specifications", {})
        data.setdefault("spec_images", [])
        
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
    # ✅ NEW: Methods for Sale & Specifications
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
        
        # 3. Add Category Filter (Only if category is NOT None and NOT empty)
        if category and category.strip():
            # Exact match but case-insensitive is safest for MongoDB
            filter_query["category"] = {"$regex": f"^{category}$", "$options": "i"}
        
        return await self.find_all(skip=skip, limit=limit, filter_query=filter_query)