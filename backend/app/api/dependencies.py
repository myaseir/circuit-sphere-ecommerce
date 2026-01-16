from typing import Generator
from fastapi import Depends
from functools import lru_cache

from app.usecases.kit_usecase import KitUseCase
from app.usecases.order_usecase import OrderUseCase
from app.repositories.kit_repository import KitRepository
from app.repositories.order_repository import OrderRepository

@lru_cache()
def get_kit_repository() -> KitRepository:
    """Get kit repository instance"""
    return KitRepository()

@lru_cache()
def get_order_repository() -> OrderRepository:
    """Get order repository instance"""
    return OrderRepository()

def get_kit_usecase(
    repo: KitRepository = Depends(get_kit_repository)
) -> KitUseCase:
    """Get kit usecase instance with dependencies"""
    return KitUseCase(repo)

def get_order_usecase(
    order_repo: OrderRepository = Depends(get_order_repository),
    kit_repo: KitRepository = Depends(get_kit_repository)
) -> OrderUseCase:
    """Get order usecase instance with dependencies"""
    return OrderUseCase(order_repo, kit_repo)