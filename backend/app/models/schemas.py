from typing import List, Optional, Any, Union, Dict
from datetime import datetime
from pydantic import BaseModel, Field
from .entities import Component, OrderStatus

# --------------------------------------
# REVIEW SCHEMAS (NEW)
# --------------------------------------

class ReviewBase(BaseModel):
    reviewer_name: str = Field(..., min_length=1, description="Guest name")
    rating: int = Field(..., ge=1, le=5, description="Star rating 1-5")
    comment: str = Field(..., min_length=1, description="Review content")

class ReviewCreate(ReviewBase):
    # No extra fields needed. 
    # 'product_id' will typically come from the URL endpoint.
    pass

class ReviewResponse(ReviewBase):
    id: str  # Using str to match your existing ID pattern
    product_id: str
    created_at: datetime
    
    # Internal usage fields (optional to expose, but useful)
    is_visible: bool = True

    class Config:
        from_attributes = True


# --------------------------------------
# KIT SCHEMAS
# --------------------------------------

# 1. Base Schema (Shared fields)
class KitBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    stock_quantity: int
    category: str
    
    # Image can be a list of strings OR a single string
    image_url: Optional[Union[List[str], str]] = []
    
    # --- SALE & SPECS ---
    original_price: Optional[float] = None
    on_sale: bool = False
    specifications: Dict[str, str] = {} 
    spec_images: List[str] = []         
    # ------------------------------------------------------------
    
    is_active: bool = True
    components: List[Component] = []


# 2. Create Schema
class KitCreate(KitBase):
    slug: Optional[str] = None  # Allow manual slug creation


# 3. Update Schema
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


# 4. Response Schema (UPDATED)
class KitResponse(KitBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    # ✅ Added Slug (Backend calculates it, frontend might need it)
    slug: Optional[str] = None
    
    # --- NEW: REVIEW AGGREGATES ---
    # ✅ FIX: These fields allow the rating to show on the card
    average_rating: float = 0.0
    total_reviews: int = 0
    # ------------------------------
    
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