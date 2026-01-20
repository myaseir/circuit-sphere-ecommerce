import json # ✅ Need this to parse specifications string
import cloudinary
import cloudinary.uploader
from typing import List, Optional, Dict
from fastapi import APIRouter, Depends, Query, HTTPException, status, UploadFile, File, Form, Body, Request

from app.usecases.kit_usecase import KitUseCase
from app.models.schemas import (
    KitUpdate, 
    KitResponse, 
    PaginatedResponse,
    SaleToggleRequest, # ✅ Import this schema
    ReviewCreate,      # ✅ NEW: For review submission
    ReviewResponse     # ✅ NEW: For listing reviews
)
from app.api.dependencies import get_kit_usecase
from app.core.exceptions import NotFoundException, ValidationException

# 1. Configure Cloudinary
cloudinary.config( 
    cloud_name = "dxxqrjnje", 
    api_key = "161245221439653", 
    api_secret = "3g97_l3R6TzKrobErlVP9P6ugts",
    secure = True
)

router = APIRouter()

@router.get("/", response_model=List[KitResponse])
async def list_kits(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    active_only: bool = Query(True),
    # ✅ 1. Ensure this exact variable name matches what the frontend sends
    category: Optional[str] = Query(None, description="Filter by category"),
    usecase: KitUseCase = Depends(get_kit_usecase)
):
    # ✅ 2. Pass 'category' into the usecase method
    kits = await usecase.get_all_kits(
        skip=skip, 
        limit=limit, 
        active_only=active_only, 
        category=category  # 👈 This was likely missing!
    ) 
    return kits

# ✅ UPDATED POST METHOD: Handles Regular Images, Spec Diagrams, and Sale Data
@router.post("/", response_model=KitResponse, status_code=status.HTTP_201_CREATED)
async def create_kit(
    name: str = Form(...),
    price: float = Form(...),
    stock_quantity: int = Form(...),
    description: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    
    # --- NEW: Sale & Specs Fields (Form Data) ---
    original_price: Optional[float] = Form(None),
    on_sale: bool = Form(False),
    # Specs come as a JSON string: '{"Voltage": "5V"}'
    specifications_json: Optional[str] = Form(None), 
    
    # --- IMAGES ---
    images: List[UploadFile] = File(default=[]),      # Main Product Gallery
    spec_images: List[UploadFile] = File(default=[]), # Technical Diagrams
    
    usecase: KitUseCase = Depends(get_kit_usecase)
):
    """Create a new kit with Cloudinary uploads for both Gallery and Specs"""
    
    gallery_urls = []
    spec_diagram_urls = []
    
    try:
        # 1. Upload Main Gallery Images
        for image in images:
            res = cloudinary.uploader.upload(image.file, folder="electronic_kits")
            gallery_urls.append(res["secure_url"])

        # 2. Upload Technical/Spec Images (if any)
        for img in spec_images:
            res = cloudinary.uploader.upload(img.file, folder="electronic_kits/specs")
            spec_diagram_urls.append(res["secure_url"])

        # 3. Parse Specifications JSON String -> Dict
        parsed_specs = {}
        if specifications_json:
            try:
                parsed_specs = json.loads(specifications_json)
            except json.JSONDecodeError:
                # Fallback or Log error if invalid JSON sent
                print("Invalid JSON for specifications")
                parsed_specs = {}

        # 4. Construct Data Object
        kit_data = {
            "name": name,
            "price": price,
            "description": description,
            "category": category,
            "stock_quantity": stock_quantity,
            "image_url": gallery_urls,     # Main Images
            "is_active": True,
            
            # New Fields
            "original_price": original_price,
            "on_sale": on_sale,
            "specifications": parsed_specs, # Saved as Dict/JSON
            "spec_images": spec_diagram_urls # Saved as List/JSON
        }

        # 5. Save to DB
        return await usecase.create_kit_from_form(kit_data)

    except Exception as e:
        print(f"Cloudinary/DB Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create product: {str(e)}"
        )

# ---------------------------------------------------------
# ✅ NEW: Toggle Sale Endpoint
# ---------------------------------------------------------
@router.patch("/{kit_id}/toggle-sale", response_model=KitResponse)
async def toggle_sale(
    kit_id: str, 
    sale_data: SaleToggleRequest, 
    usecase: KitUseCase = Depends(get_kit_usecase)
):
    """Instant switch to turn sale ON/OFF"""
    try:
        # You need to ensure your usecase has a toggle_sale method calling repository
        # If your usecase doesn't have it yet, add it to kit_usecase.py
        return await usecase.toggle_sale_status(kit_id, sale_data.on_sale)
    except NotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))

# ---------------------------------------------------------
# ✅ NEW: Review Endpoints (Added Here)
# ---------------------------------------------------------

@router.post("/{kit_id}/reviews", response_model=ReviewResponse)
async def create_review(
    kit_id: str,
    review: ReviewCreate,
    request: Request,
    usecase: KitUseCase = Depends(get_kit_usecase)
):
    """
    Submit a review for a specific Kit.
    Includes rate limiting: 1 review per IP per 10 mins.
    """
    # 1. Prepare data
    review_data = review.model_dump()
    review_data["product_id"] = kit_id
    
    # 2. Get IP for spam check
    client_ip = request.client.host
    
    try:
        return await usecase.add_review(review_data, client_ip)
    except Exception as e:
        # Catch the rate limit error from UseCase
        if "Rate limit" in str(e):
            raise HTTPException(status_code=429, detail=str(e))
        raise HTTPException(status_code=400, detail=str(e))

# ✅ FIX: Updated to accept 'skip' for pagination
@router.get("/{kit_id}/reviews", response_model=List[ReviewResponse])
async def get_reviews(
    kit_id: str,
    skip: int = Query(0, ge=0),          # <--- Added 'skip'
    limit: int = Query(6, ge=1, le=50),  # <--- Changed default to 6 to match frontend
    usecase: KitUseCase = Depends(get_kit_usecase)
):
    """
    Get the latest reviews for this kit.
    Supports pagination via 'skip' and 'limit'.
    """
    try:
        # Pass skip/limit to usecase
        return await usecase.get_reviews_for_kit(kit_id, skip=skip, limit=limit)
    except NotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))

# ---------------------------------------------------------
# EXISTING ROUTES
# ---------------------------------------------------------

@router.get("/{kit_id}", response_model=KitResponse)
async def get_kit(kit_id: str, usecase: KitUseCase = Depends(get_kit_usecase)):
    try:
        return await usecase.get_kit_by_id(kit_id)
    except NotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.put("/{kit_id}", response_model=KitResponse)
async def update_kit(kit_id: str, kit_update: KitUpdate, usecase: KitUseCase = Depends(get_kit_usecase)):
    try:
        return await usecase.update_kit(kit_id, kit_update)
    except (NotFoundException, ValidationException) as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{kit_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_kit(kit_id: str, usecase: KitUseCase = Depends(get_kit_usecase)):
    try:
        await usecase.delete_kit(kit_id)
    except NotFoundException as e:
        raise HTTPException(status_code=404, detail=str(e))