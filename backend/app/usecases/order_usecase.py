from typing import List, Dict, Any
import logging

from app.models.schemas import OrderCreate, OrderStatusUpdate
from app.models.entities import OrderStatus
from app.repositories.order_repository import OrderRepository
from app.repositories.kit_repository import KitRepository
from app.core.exceptions import ValidationException, NotFoundException

logger = logging.getLogger(__name__)

class OrderUseCase:
    """Business logic for order operations"""
    
    def __init__(
        self, 
        order_repository: OrderRepository = None,
        kit_repository: KitRepository = None
    ):
        self.order_repository = order_repository or OrderRepository()
        self.kit_repository = kit_repository or KitRepository()
    
    async def get_all_orders(
        self, 
        skip: int = 0, 
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        """Get all orders with pagination"""
        return await self.order_repository.find_all(skip, limit)
    
    async def get_order_by_id(self, order_id: str) -> Dict[str, Any]:
        """Get order by ID"""
        return await self.order_repository.find_by_id(order_id)
    
    async def create_order(self, order_data: OrderCreate) -> Dict[str, Any]:
        """
        Create a new order with multiple items
        
        Steps:
        1. Loop through ALL items to validate existence and stock.
        2. Create the order in the database.
        3. Loop through items again to deduct stock.
        """
        
        # --- Step 1: Validate ALL items first ---
        # We do this before creating the order to ensure we don't end up 
        # with an order that can't be fulfilled.
        for item in order_data.items:
            # 1a. Fetch kit details from DB
            try:
                kit = await self.kit_repository.find_by_id(item.id)
            except NotFoundException:
                raise ValidationException(
                    "Invalid kit",
                    {"item_id": f"Kit with id '{item.id}' not found"}
                )
            
            # 1b. Check if kit is active
            if not kit.get("is_active", True):
                raise ValidationException(
                    "Kit not available",
                    {"item": f"Item '{item.title}' is currently unavailable"}
                )
            
            # 1c. Check stock availability
            current_stock = kit.get("stock_quantity", 0)
            if current_stock < item.quantity:
                raise ValidationException(
                    "Insufficient stock",
                    {
                        "item": item.title,
                        "available": current_stock,
                        "requested": item.quantity
                    }
                )

        # --- Step 2: Create Order in Database ---
        # Pydantic's .dict() automatically handles the nested 'customer' and 'items'
        order_dict = order_data.dict()
        
        # Optional: You could recalculate total_amount here for security, 
        # but for now we trust the schema/frontend total.
        
        order = await self.order_repository.create(order_dict)
        
        # --- Step 3: Deduct Stock for ALL items ---
        # Now that the order is safely created, we remove the items from inventory
        for item in order_data.items:
            await self.kit_repository.update_stock(item.id, -item.quantity)
        
        logger.info(f"Order created: {order['id']} with {len(order_data.items)} items")
        return order
    
    async def update_order_status(
        self, 
        order_id: str, 
        status_update: OrderStatusUpdate
    ) -> Dict[str, Any]:
        """Update order status"""
        # Check if order exists
        order = await self.order_repository.find_by_id(order_id)
        
        # Validate status transition
        current_status = order.get("status")
        new_status = status_update.status
        
        # Define allowed status transitions
        allowed_transitions = {
            OrderStatus.PENDING: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
            OrderStatus.PROCESSING: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
            OrderStatus.SHIPPED: [OrderStatus.DELIVERED],
            OrderStatus.DELIVERED: [],
            OrderStatus.CANCELLED: []
        }
        
        if new_status not in allowed_transitions.get(current_status, []):
            raise ValidationException(
                "Invalid status transition",
                {
                    "current_status": current_status,
                    "new_status": new_status,
                    "allowed": allowed_transitions.get(current_status, [])
                }
            )
        
        return await self.order_repository.update_status(order_id, new_status)
    
    async def get_orders_by_customer(self, email: str) -> List[Dict[str, Any]]:
        """Get all orders for a customer"""
        return await self.order_repository.find_by_customer(email)
    
    async def get_orders_by_status(
        self, 
        status: OrderStatus,
        skip: int = 0,
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        """Get orders by status"""
        return await self.order_repository.find_by_status(status, skip, limit)