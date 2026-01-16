from typing import List, Optional, Dict
from datetime import datetime
from pydantic import BaseModel, Field
from enum import Enum

# ---------------------------------------------------------
# KIT & COMPONENT ENTITIES (Updated with Sale & Specs)
# ---------------------------------------------------------
class Component(BaseModel):
    """Component entity"""
    name: str = Field(..., min_length=1, max_length=100)
    quantity: int = Field(..., gt=0)
    description: Optional[str] = Field(None, max_length=500)

class Kit(BaseModel):
    """Kit entity"""
    name: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1, max_length=1000)
    price: float = Field(..., gt=0)
    
    # --- NEW: Sale & Discount Handling ---
    original_price: Optional[float] = Field(None, gt=0, description="The 'crossed out' price")
    on_sale: bool = Field(False, description="Toggle to activate/deactivate discount appearance")
    
    # --- NEW: Technical Specifications & Diagrams ---
    # Dict[str, str] allows {"Voltage": "5V", "MCU": "ESP32"}
    specifications: Dict[str, str] = Field(default_factory=dict) 
    # List[str] allows ["url_to_pinout.png", "url_to_schematic.png"]
    spec_images: List[str] = Field(default_factory=list)

    image_url: Optional[str] = None
    category: str = Field(..., min_length=1, max_length=100)
    components: List[Component]
    stock_quantity: int = Field(..., ge=0)
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

# ---------------------------------------------------------
# ORDER ENTITIES (Unchanged)
# ---------------------------------------------------------

class OrderStatus(str, Enum):
    """Order status enumeration"""
    PENDING = "pending"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class OrderCustomer(BaseModel):
    """Customer details for an order"""
    first_name: str
    last_name: str
    email: str
    phone: str
    address: str
    city: str
    zip: str
    country: str

class OrderItem(BaseModel):
    """Item details inside an order"""
    id: str  
    title: str
    price: float
    quantity: int = Field(..., gt=0)

class Order(BaseModel):
    """Order entity"""
    customer: OrderCustomer
    items: List[OrderItem]
    total_amount: float = Field(..., gt=0) 
    payment_method: str
    status: OrderStatus = OrderStatus.PENDING
    notes: Optional[str] = Field(None, max_length=1000)
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None