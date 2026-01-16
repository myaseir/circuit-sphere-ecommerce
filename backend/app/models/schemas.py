from typing import List, Optional, Any, Union, Dict
from datetime import datetime
from pydantic import BaseModel, Field
from .entities import Component, OrderStatus

# --------------------------------------
# KIT SCHEMAS
# --------------------------------------

# 1. Base Schema (Shared fields)
# This prevents repeating code in Create and Response
class KitBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    stock_quantity: int
    category: str
    
    # Image can be a list of strings OR a single string (for backward compatibility)
    image_url: Optional[Union[List[str], str]] = []
    
    # --- SALE & SPECS (Now in Base, so they cover everything) ---
    original_price: Optional[float] = None
    on_sale: bool = False
    specifications: Dict[str, str] = {}  # e.g. {"Voltage": "5V"}
    spec_images: List[str] = []          # e.g. ["url_to_diagram.png"]
    # ------------------------------------------------------------
    
    is_active: bool = True
    components: List[Component] = []


# 2. Create Schema (Inherits from Base)
class KitCreate(KitBase):
    pass 
    # Logic: inherits everything from KitBase. 
    # You can add fields specific to creation here if needed.


# 3. Update Schema (Everything Optional)
class KitUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock_quantity: Optional[int] = None
    category: Optional[str] = None
    image_url: Optional[Union[List[str], str]] = None
    is_active: Optional[bool] = None
    
    # --- SALE & SPECS UPDATES ---
    original_price: Optional[float] = None
    on_sale: Optional[bool] = None
    specifications: Optional[Dict[str, str]] = None
    spec_images: Optional[List[str]] = None
    # ----------------------------


# 4. Response Schema (Inherits Base + ID/Timestamps)
class KitResponse(KitBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# 5. Toggle Request Schema
class SaleToggleRequest(BaseModel):
    on_sale: bool


# --------------------------------------
# ORDER SCHEMAS
# --------------------------------------

class OrderCustomer(BaseModel):
    firstName: str
    lastName: str
    email: str
    phone: str
    address: str
    city: str
    zip: str
    country: str

class OrderItem(BaseModel):
    id: str
    title: str
    discountedPrice: float
    quantity: int
    
    class Config:
        extra = "ignore"

class OrderCreate(BaseModel):
    customer: OrderCustomer
    items: List[OrderItem]
    paymentMethod: str
    notes: Optional[str] = None
    totalAmount: float

class OrderStatusUpdate(BaseModel):
    status: OrderStatus

class OrderResponse(BaseModel):
    id: str
    customer: OrderCustomer 
    items: List[OrderItem]   
    paymentMethod: str
    totalAmount: float
    status: OrderStatus
    notes: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# --------------------------------------
# PAGINATION SCHEMA
# --------------------------------------
class PaginatedResponse(BaseModel):
    items: List[Any]
    total: int
    page: int
    size: int
    pages: int