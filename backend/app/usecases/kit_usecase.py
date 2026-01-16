from typing import List, Dict, Any, Optional
import logging
from datetime import datetime
from bson import ObjectId

from app.models.schemas import KitCreate, KitUpdate
from app.repositories.kit_repository import KitRepository
from app.core.exceptions import ValidationException, NotFoundException, DatabaseException

logger = logging.getLogger(__name__)

class KitUseCase:
    """Business logic for Circuit Sphere kit operations"""
    
    def __init__(self, kit_repository: KitRepository = None):
        self.kit_repository = kit_repository or KitRepository()

    # ==========================================
    # ✅ FETCHING & FILTERING (Fixed for Long Categories)
    # ==========================================
    async def get_all_kits(
        self, 
        skip: int = 0, 
        limit: int = 100, 
        active_only: bool = True, 
        category: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Fetch kits with optional category filtering (Handled via Repository)"""
        try:
            logger.info(f"Fetching kits: category={category}, active_only={active_only}")
            
            # We use search_kits as the primary engine because it handles 
            # the complex string matching for your long category names.
            kits = await self.kit_repository.search_kits(
                query="", 
                category=category, 
                skip=skip, 
                limit=limit
            )
            
            # Apply active filter if requested
            if active_only:
                kits = [k for k in kits if k.get("is_active", True)]
            
            return [self._format_kit_response(kit) for kit in kits]
            
        except Exception as e:
            logger.error(f"Error fetching kits: {str(e)}", exc_info=True)
            raise DatabaseException(f"Could not retrieve products: {str(e)}")

    # ==========================================
    # ✅ PRODUCT CREATION (Form & Schema)
    # ==========================================
    async def create_kit_from_form(self, kit_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new kit from Dictionary data (supports Cloudinary image uploads)"""
        try:
            # 1. Manual Validation
            self._validate_raw_data(kit_data)
            
            # 2. Add Meta & Feature Defaults
            now = datetime.utcnow()
            kit_data.update({
                "created_at": now,
                "updated_at": now,
                "is_active": True,
                "on_sale": kit_data.get("on_sale", False),
                "original_price": kit_data.get("original_price"),
                "specifications": kit_data.get("specifications", {}),
                "spec_images": kit_data.get("spec_images", []),
                "image_url": kit_data.get("image_url", [])
            })

            # 3. Persistence
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
            kit_dict.update({"created_at": now, "updated_at": now, "is_active": True})
            
            created_doc = await self.kit_repository.create(kit_dict)
            return self._format_kit_response(created_doc)
        except Exception as e:
            if isinstance(e, ValidationException): raise
            raise DatabaseException(str(e))

    # ==========================================
    # ✅ UPDATES & STOCK MANAGEMENT
    # ==========================================
    async def toggle_sale_status(self, kit_id: str, on_sale: bool) -> Dict[str, Any]:
        """Instant toggle for promotional sales"""
        self._validate_object_id(kit_id)
        
        updated_kit = await self.kit_repository.toggle_sale_status(kit_id, on_sale)
        if not updated_kit:
            raise NotFoundException(f"Kit {kit_id} not found for sale update")
            
        return self._format_kit_response(updated_kit)

    async def update_kit_stock(self, kit_id: str, quantity_change: int) -> Dict[str, Any]:
        """Adjust inventory levels (+ for restock, - for sales)"""
        self._validate_object_id(kit_id)
        
        kit = await self.kit_repository.find_by_id(kit_id)
        if not kit: raise NotFoundException("Kit not found")
        
        if kit.get("stock_quantity", 0) + quantity_change < 0:
            raise ValidationException("Insufficient stock to perform this operation")
            
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
        """Soft delete: sets is_active to False"""
        self._validate_object_id(kit_id)
        success = await self.kit_repository.update(kit_id, {
            "is_active": False, 
            "updated_at": datetime.utcnow()
        })
        if not success: raise NotFoundException("Kit not found for deletion")
        return True

    # ==========================================
    # 🛠 HELPERS (Internal Validation & Formatting)
    # ==========================================
    def _validate_object_id(self, id_str: str):
        if not ObjectId.is_valid(id_str):
            raise ValidationException(f"ID '{id_str}' is not a valid MongoDB ObjectId")

    def _validate_raw_data(self, data: Dict):
        if data.get("price", 0) <= 0: raise ValidationException("Price must be > 0")
        if not data.get("name"): raise ValidationException("Product name is required")

    def _validate_kit_schema(self, data: KitCreate):
        if data.price <= 0: raise ValidationException("Price must be positive")

    def _format_kit_response(self, kit: Dict[str, Any]) -> Dict[str, Any]:
        """Standardizes output and ensures all Circuit Sphere features exist"""
        if not kit: return {}
        
        res = kit.copy()
        # Convert BSON ObjectId to String
        if "_id" in res:
            res["id"] = str(res.pop("_id"))
        elif "id" in res and isinstance(res["id"], ObjectId):
            res["id"] = str(res["id"])
            
        # Guarantee presence of FYP and Sales features
        res["on_sale"] = res.get("on_sale", False)
        res["original_price"] = res.get("original_price")
        res["specifications"] = res.get("specifications", {})
        res["spec_images"] = res.get("spec_images", [])
        res["image_url"] = res.get("image_url", [])
        res["category"] = res.get("category", "General")
        
        return res