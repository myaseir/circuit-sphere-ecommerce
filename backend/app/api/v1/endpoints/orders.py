from typing import List
from fastapi import APIRouter, Depends, Query, HTTPException, status

from app.usecases.order_usecase import OrderUseCase
from app.models.schemas import (
    OrderCreate, 
    OrderResponse,
    OrderStatusUpdate
)
from app.models.entities import OrderStatus
from app.api.dependencies import get_order_usecase
from app.core.exceptions import NotFoundException, ValidationException

router = APIRouter()

@router.get("/", response_model=List[OrderResponse])
async def list_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    usecase: OrderUseCase = Depends(get_order_usecase)
):
    """Get all orders with pagination"""
    orders = await usecase.get_all_orders(skip, limit)
    return orders

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: str,
    usecase: OrderUseCase = Depends(get_order_usecase)
):
    """Get order by ID"""
    try:
        return await usecase.get_order_by_id(order_id)
    except NotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )

@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    order: OrderCreate,
    usecase: OrderUseCase = Depends(get_order_usecase)
):
    """Create a new order"""
    try:
        return await usecase.create_order(order)
    except (NotFoundException, ValidationException) as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=e.details
        )

@router.patch("/{order_id}/status", response_model=OrderResponse)
async def update_order_status(
    order_id: str,
    status_update: OrderStatusUpdate,
    usecase: OrderUseCase = Depends(get_order_usecase)
):
    """Update order status"""
    try:
        return await usecase.update_order_status(order_id, status_update)
    except NotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except ValidationException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=e.details
        )

@router.get("/customer/{email}", response_model=List[OrderResponse])
async def get_customer_orders(
    email: str,
    usecase: OrderUseCase = Depends(get_order_usecase)
):
    """Get all orders for a customer"""
    try:
        return await usecase.get_orders_by_customer(email)
    except ValidationException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=e.details
        )

@router.get("/status/{status}", response_model=List[OrderResponse])
async def get_orders_by_status(
    status: OrderStatus,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    usecase: OrderUseCase = Depends(get_order_usecase)
):
    """Get orders by status"""
    try:
        return await usecase.get_orders_by_status(status, skip, limit)
    except ValidationException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=e.details
        )