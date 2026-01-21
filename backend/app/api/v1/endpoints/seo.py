import xml.etree.ElementTree as ET
from typing import List, Optional, Any
from fastapi import APIRouter, Response

# 1. IMPORT ENTITIES & DB HELPER
from app.models.entities import Kit
from app.database import get_collection 

# --- 1. INTERNAL SCHEMA ---
from pydantic import BaseModel

# Helper class to ensure ID exists
class KitWithId(Kit):
    id: Optional[str] = None

class GoogleProductSchema(BaseModel):
    id: str
    title: str
    description: str
    link: str
    image_link: str
    price: str
    sale_price: Optional[str] = None
    availability: str
    brand: str
    condition: str = "new"
    product_type: str  # <--- NEW FIELD

    @classmethod
    def from_kit(cls, kit: Kit, base_url: str, kit_id: str):
        # Price formatting
        current_price = f"{kit.price} PKR"
        sale_price_str = None
        
        if kit.on_sale and kit.original_price:
            current_price = f"{kit.original_price} PKR"
            sale_price_str = f"{kit.price} PKR"

        # Stock status
        stock_status = "in stock" if kit.stock_quantity > 0 else "out of stock"

        # Handle potential missing specs safely
        specs = kit.specifications if kit.specifications else {}
        brand_name = specs.get("Brand", "Glacia Labs")
        
        # Get Category safely
        category_name = getattr(kit, "category", "Electronics")
        
        return cls(
            id=kit_id,
            title=kit.name,
            description=kit.description[:500] if kit.description else "",
            link=f"{base_url}/product/{kit_id}",
            image_link=kit.image_url or "",
            price=current_price,
            sale_price=sale_price_str,
            availability=stock_status,
            brand=brand_name,
            product_type=category_name # <--- Map the category
        )

# --- 2. LOGIC CLASS ---
class GenerateGoogleFeedUseCase:
    def execute(self, kits: List[Any], base_url: str) -> str:
        rss = ET.Element("rss", version="2.0")
        rss.set("xmlns:g", "http://base.google.com/ns/1.0")
        channel = ET.SubElement(rss, "channel")
        
        ET.SubElement(channel, "title").text = "Glacia Labs Products"
        ET.SubElement(channel, "link").text = base_url
        ET.SubElement(channel, "description").text = "Premium Electronics Kits"
        
        for kit in kits:
            if not kit: continue
            try:
                # Handle ID safely
                kit_id = str(kit.id) if hasattr(kit, 'id') and kit.id else "unknown"
                
                if kit_id == "unknown":
                    continue

                item_data = GoogleProductSchema.from_kit(kit, base_url, kit_id)
                
                item = ET.SubElement(channel, "item")
                ET.SubElement(item, "g:id").text = item_data.id
                ET.SubElement(item, "g:title").text = item_data.title
                ET.SubElement(item, "g:description").text = item_data.description
                ET.SubElement(item, "g:link").text = item_data.link
                ET.SubElement(item, "g:image_link").text = item_data.image_link
                ET.SubElement(item, "g:price").text = item_data.price
                ET.SubElement(item, "g:availability").text = item_data.availability
                ET.SubElement(item, "g:brand").text = item_data.brand
                ET.SubElement(item, "g:condition").text = "new"
                ET.SubElement(item, "g:product_type").text = item_data.product_type # <--- Write to XML
                
                if item_data.sale_price:
                    ET.SubElement(item, "g:sale_price").text = item_data.sale_price
                    
            except Exception as e:
                print(f"Skipping item {getattr(kit, 'name', 'unknown')}: {e}")
                continue

        return ET.tostring(rss, encoding='unicode')

# --- 3. THE ROUTE ---
router = APIRouter()

@router.get("/feed.xml", include_in_schema=False)
async def get_google_merchant_feed():
    """
    Fetches kits from MongoDB, converts to XML, and serves the feed.
    """
    try:
        collection = get_collection("kits")
        
        # DEBUG MODE: fetching all items.
        # REMINDER: Before launch, change {} to {"is_active": True}
        raw_kits = await collection.find({}).to_list(length=1000)
        
        clean_kits = []
        for doc in raw_kits:
            try:
                # 1. Fix ObjectId
                if "_id" in doc:
                    doc["id"] = str(doc.pop("_id"))
                
                # 2. Defaults
                if "components" not in doc: doc["components"] = []
                if "stock_quantity" not in doc: doc["stock_quantity"] = 0
                if "category" not in doc: doc["category"] = "Electronics" # Default category
                
                # 3. Fix Image List
                if "image_url" in doc and isinstance(doc["image_url"], list):
                    doc["image_url"] = doc["image_url"][0] if doc["image_url"] else ""

                # 4. Use Wrapper
                clean_kits.append(KitWithId(**doc))
                
            except Exception as e:
                print(f"Data error in kit '{doc.get('name', 'Unknown')}': {e}")
                continue

        use_case = GenerateGoogleFeedUseCase()
        xml_content = use_case.execute(clean_kits, base_url="https://www.glacialabs.com")
        
        return Response(content=xml_content, media_type="application/xml")
        
    except Exception as e:
        return Response(content=f"<error>Database Error: {str(e)}</error>", status_code=500, media_type="application/xml")