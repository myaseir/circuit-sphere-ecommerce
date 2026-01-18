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
                "slug": kit_data.get("slug") or kit_data["name"].lower().replace(" ", "-")
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
                # Create slug from name if missing
                "slug": kit_dict.get("slug") or kit_dict["name"].lower().replace(" ", "-")
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
            # ✅ FIX: Added errors=[] to prevent crash
            raise ValidationException("Insufficient stock to perform this operation", errors=[])
            
        updated = await self.kit_repository.update_stock(kit_id, quantity_change)
        return self._format_kit_response(updated)

    # ==========================================
    # ✅ GET, UPDATE, DELETE (CRUD)
    # ==========================================
    async def get_kit_by_id(self, kit_id: str) -> Dict[str, Any]:
        self._validate_object_id(kit_id)
        kit = await self.kit_repository.find_by_id(kit_id)
        if not kit: raise NotFoundException(f"Kit {kit_id} not found")
        return self._format_kit_response(kit)

    # ✅ NEW: Added support for finding by Slug (e.g., /kits/esp32)
    async def get_kit_by_slug(self, slug: str) -> Dict[str, Any]:
        # Search repository for this slug
        # Note: You might need to add `find_one({"slug": slug})` to your repository if it doesn't exist
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
            # ✅ FIX: Added errors=[] to prevent 500 Crash
            raise ValidationException(f"ID '{id_str}' is not a valid MongoDB ObjectId", errors=[])

    def _validate_raw_data(self, data: Dict):
        # ✅ FIX: Added errors=[]
        if data.get("price", 0) <= 0: 
            raise ValidationException("Price must be > 0", errors=[])
        if not data.get("name"): 
            raise ValidationException("Product name is required", errors=[])

    def _validate_kit_schema(self, data: KitCreate):
        # ✅ FIX: Added errors=[]
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
        # Ensure slug exists in response
        res["slug"] = res.get("slug") or res.get("name", "").lower().replace(" ", "-")
        
        return res