from typing import List, Dict, Any, Optional
from datetime import datetime

from .base import BaseRepository
from app.models.entities import Order, OrderStatus

class OrderRepository(BaseRepository[Order]):
    """Order repository for data access operations"""
    
    def __init__(self):
        super().__init__("orders", Order)
    
    async def create(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new order with timestamps"""
        data["created_at"] = datetime.utcnow()
        data["updated_at"] = datetime.utcnow()
        data["status"] = OrderStatus.PENDING
        return await super().create(data)
    
    async def find_by_customer(self, email: str) -> List[Dict[str, Any]]:
        """Find all orders for a customer"""
        return await self.find_all(filter_query={"customer_email": email})
    
    async def update_status(self, order_id: str, status: OrderStatus) -> Dict[str, Any]:
        """Update order status"""
        return await self.update(order_id, {
            "status": status,
            "updated_at": datetime.utcnow()
        })
    
    async def find_by_status(
        self, 
        status: OrderStatus,
        skip: int = 0,
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        """Find orders by status"""
        return await self.find_all(
            skip=skip,
            limit=limit,
            filter_query={"status": status}
        )