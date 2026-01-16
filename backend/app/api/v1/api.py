from fastapi import APIRouter
from .endpoints import kits, orders # ✅ This now works with orders.py

api_router = APIRouter()

api_router.include_router(kits.router, prefix="/kits", tags=["kits"])
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])