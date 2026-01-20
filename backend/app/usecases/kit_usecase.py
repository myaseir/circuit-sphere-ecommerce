from typing import List, Dict, Any, Optional
import logging
from datetime import datetime
from bson import ObjectId

from app.models.schemas import KitCreate, KitUpdate
from app.repositories.kit_repository import KitRepository
from app.core.exceptions import ValidationException, NotFoundException, DatabaseException

logger = logging.getLogger(__name__)

class KitUseCase:
    """Business logic for Glacia Labs kit operations"""
    
    def __init__(self, kit_repository: KitRepository = None):
        self.kit_repository = kit_repository or KitRepository()

    # ==========================================
    # ✅ FETCHING & FILTERING
    # ==========================================
    async def get_all_kits(
        self, 
        skip: int = 0, 
        limit: int = 100, 
        active_only: bool = True, 
        category: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Fetch kits with optional category filtering"""
        try:
            logger.info(f"Fetching kits: category={category}, active_only={active_only}")
            
            kits = await self.kit_repository.search_kits(
                query="", 
                category=category, 
                skip=skip, 
                limit=limit
            )
            
            if active_only:
                kits = [k for k in kits if k.get("is_active", True)]
            
            return [self._format_kit_response(kit) for kit in kits]
            
        except Exception as e:
            logger.error(f"Error fetching kits: {str(e)}", exc_info=True)
            raise DatabaseException(f"Could not retrieve products: {str(e)}")

    # ==========================================
    # ✅ PRODUCT CREATION
    # ==========================================
    async def create_kit_from_form(self, kit_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new kit from Dictionary data"""
        try:
            self._validate_raw_data(kit_data)
            
            now = datetime.utcnow()
            kit_data.update({
                "created_at": now,
                "updated_at": now,
                "is_active": True,
                "on_sale": kit_data.get("on_sale", False),
                "original_price": kit_data.get("original_price"),
                "specifications": kit_data.get("specifications", {}),
                "spec_images": kit_data.get("spec_images", []),
                "image_url": kit_data.get("image_url", []),
                # Auto-generate slug if not provided
                "slug": kit_data.get("slug") or kit_data["name"].lower().replace(" ", "-"),
                
                # Default ratings for new product
                "average_rating": 0.0,
                "total_reviews": 0
            })

            created_doc = await self.kit_repository.create(kit_data)
            if not created_doc:
                raise DatabaseException("Database failed to save the kit.")

            return self._format_kit_response(created_doc)

        except Exception as e:
            logger.error(f"Form creation error: {str(e)}")
            if isinstance(e, ValidationException): raise
            raise DatabaseException(str(e))

    async def create_kit(self, kit_data: KitCreate) -> Dict[str, Any]:
        """Standard JSON-based creation"""
        try:
            self._validate_kit_schema(kit_data)
            kit_dict = kit_data.dict()
            now = datetime.utcnow()
            kit_dict.update({
                "created_at": now, 
                "updated_at": now, 
                "is_active": True,
                "slug": kit_dict.get("slug") or kit_dict["name"].lower().replace(" ", "-"),
                "average_rating": 0.0,
                "total_reviews": 0
            })
            
            created_doc = await self.kit_repository.create(kit_dict)
            return self._format_kit_response(created_doc)
        except Exception as e:
            if isinstance(e, ValidationException): raise
            raise DatabaseException(str(e))

    # ==========================================
    # ✅ STOCK & SALES
    # ==========================================
    async def toggle_sale_status(self, kit_id: str, on_sale: bool) -> Dict[str, Any]:
        self._validate_object_id(kit_id)
        
        updated_kit = await self.kit_repository.toggle_sale_status(kit_id, on_sale)
        if not updated_kit:
            raise NotFoundException(f"Kit {kit_id} not found for sale update")
            
        return self._format_kit_response(updated_kit)

    async def update_kit_stock(self, kit_id: str, quantity_change: int) -> Dict[str, Any]:
        self._validate_object_id(kit_id)
        
        kit = await self.kit_repository.find_by_id(kit_id)
        if not kit: raise NotFoundException("Kit not found")
        
        if kit.get("stock_quantity", 0) + quantity_change < 0:
            raise ValidationException("Insufficient stock to perform this operation", errors=[])
            
        updated = await self.kit_repository.update_stock(kit_id, quantity_change)
        return self._format_kit_response(updated)

    # ==========================================
    # ✅ REVIEWS (NEW MERGED LOGIC)
    # ==========================================
    
    async def add_review(self, review_data: Dict[str, Any], client_ip: str) -> Dict[str, Any]:
        """
        1. Check Rate Limit (Spam Protection)
        2. Create Review via Repository
        """
        product_id = review_data.get("product_id")
        
        # 1. Spam Check
        can_post = await self.kit_repository.check_review_rate_limit(client_ip, product_id)
        if not can_post:
            # Return specific error message for the API to catch
            raise ValidationException("Rate limit exceeded: You can only review this product once every 10 minutes.", errors=[])

        # 2. Save
        return await self.kit_repository.add_review(review_data)

    # ✅ UPDATED: Supports pagination (skip/limit)
    async def get_reviews_for_kit(self, kit_id: str, skip: int = 0, limit: int = 5) -> List[Dict[str, Any]]:
        """Get latest reviews for a specific kit with pagination"""
        self._validate_object_id(kit_id)
        return await self.kit_repository.get_reviews(kit_id, skip=skip, limit=limit)

    # ==========================================
    # ✅ GET, UPDATE, DELETE (CRUD)
    # ==========================================
    async def get_kit_by_id(self, kit_id: str) -> Dict[str, Any]:
        self._validate_object_id(kit_id)
        kit = await self.kit_repository.find_by_id(kit_id)
        if not kit: raise NotFoundException(f"Kit {kit_id} not found")
        return self._format_kit_response(kit)

    async def get_kit_by_slug(self, slug: str) -> Dict[str, Any]:
        kit = await self.kit_repository.find_one({"slug": slug})
        if not kit:
            raise NotFoundException(f"Product '{slug}' not found")
        return self._format_kit_response(kit)

    async def update_kit(self, kit_id: str, kit_data: KitUpdate) -> Dict[str, Any]:
        self._validate_object_id(kit_id)
        
        update_dict = kit_data.dict(exclude_unset=True)
        if not update_dict:
            return await self.get_kit_by_id(kit_id)
            
        update_dict["updated_at"] = datetime.utcnow()
        updated = await self.kit_repository.update(kit_id, update_dict)
        
        if not updated: raise NotFoundException("Kit not found for update")
        return self._format_kit_response(await self.kit_repository.find_by_id(kit_id))

    async def delete_kit(self, kit_id: str) -> bool:
        self._validate_object_id(kit_id)
        success = await self.kit_repository.update(kit_id, {
            "is_active": False, 
            "updated_at": datetime.utcnow()
        })
        if not success: raise NotFoundException("Kit not found for deletion")
        return True

    # ==========================================
    # 🛠 HELPERS
    # ==========================================
    def _validate_object_id(self, id_str: str):
        if not ObjectId.is_valid(id_str):
            raise ValidationException(f"ID '{id_str}' is not a valid MongoDB ObjectId", errors=[])

    def _validate_raw_data(self, data: Dict):
        if data.get("price", 0) <= 0: 
            raise ValidationException("Price must be > 0", errors=[])
        if not data.get("name"): 
            raise ValidationException("Product name is required", errors=[])

    def _validate_kit_schema(self, data: KitCreate):
        if data.price <= 0: 
            raise ValidationException("Price must be positive", errors=[])

    def _format_kit_response(self, kit: Dict[str, Any]) -> Dict[str, Any]:
        if not kit: return {}
        
        res = kit.copy()
        if "_id" in res:
            res["id"] = str(res.pop("_id"))
        elif "id" in res and isinstance(res["id"], ObjectId):
            res["id"] = str(res["id"])
            
        res["on_sale"] = res.get("on_sale", False)
        res["original_price"] = res.get("original_price")
        res["specifications"] = res.get("specifications", {})
        res["spec_images"] = res.get("spec_images", [])
        res["image_url"] = res.get("image_url", [])
        res["category"] = res.get("category", "General")
        res["slug"] = res.get("slug") or res.get("name", "").lower().replace(" ", "-")
        
        # --- NEW: Aggregates Defaults ---
        # Ensures existing products without these fields don't break frontend
        res["average_rating"] = res.get("average_rating", 0.0)
        res["total_reviews"] = res.get("total_reviews", 0)
        
        return res