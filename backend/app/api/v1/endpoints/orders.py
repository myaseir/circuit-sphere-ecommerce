import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List
from fastapi import APIRouter, Depends, Query, HTTPException, status, BackgroundTasks

from app.usecases.order_usecase import OrderUseCase
from app.models.schemas import OrderCreate, OrderResponse, OrderStatusUpdate
from app.models.entities import OrderStatus
from app.api.dependencies import get_order_usecase
from app.core.exceptions import NotFoundException, ValidationException

# --- CONFIGURATION ---
GMAIL_USER = "techglacia@gmail.com"
GMAIL_APP_PASSWORD = "veyrigopokjsckhw" # The 16-char code

router = APIRouter()

# --- NO-INSTALL EMAIL FUNCTION ---
def send_admin_email_sync(order_id: str, customer_name: str, amount: float, customer_email: str):
    """
    Sends email using standard Python libraries.
    NOTE: This is a synchronous 'def' so FastAPI runs it in a separate thread.
    """
    try:
        msg = MIMEMultipart()
        msg['From'] = GMAIL_USER
        msg['To'] = GMAIL_USER  # Send to Admin (You)
        msg['Subject'] = f"💰 New Order: {customer_name} (PKR {amount})"

        html_content = f"""
        <div style="font-family: Arial, sans-serif; border: 1px solid #eee; padding: 20px; max-width: 500px;">
            <h2 style="color: #007bff;">🚀 New Order Received!</h2>
            <p><b>Customer:</b> {customer_name}</p>
            <p><b>Email:</b> {customer_email}</p>
            <p><b>Amount:</b> <span style="color: green; font-weight: bold;">PKR {amount}</span></p>
            <p><b>Order ID:</b> {order_id}</p>
            <hr>
            <p style="font-size: 12px; color: #888;">Glacia Labs Admin Notification</p>
        </div>
        """
        
        msg.attach(MIMEText(html_content, 'html'))

        # Connect to Gmail Server
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(GMAIL_USER, GMAIL_APP_PASSWORD)
        text = msg.as_string()
        server.sendmail(GMAIL_USER, GMAIL_USER, text)
        server.quit()
        print(f"✅ Email sent for Order {order_id}")
        
    except Exception as e:
        print(f"❌ Failed to send email: {e}")

# --- ROUTES ---

@router.get("/", response_model=List[OrderResponse])
async def list_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    usecase: OrderUseCase = Depends(get_order_usecase)
):
    orders = await usecase.get_all_orders(skip, limit)
    return orders

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: str,
    usecase: OrderUseCase = Depends(get_order_usecase)
):
    try:
        return await usecase.get_order_by_id(order_id)
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    order: OrderCreate,
    background_tasks: BackgroundTasks,
    usecase: OrderUseCase = Depends(get_order_usecase)
):
    try:
        created_order = await usecase.create_order(order)
        
        # ✅ FIX: Handle Dictionary Access (Mongo returns a dict, not an object)
        if isinstance(created_order, dict):
            # Extract ID
            oid = str(created_order.get("_id") or created_order.get("id"))
            
            # Extract Customer Info (Handle nested or flat structure)
            cust_data = created_order.get("customer", {})
            if not isinstance(cust_data, dict): 
                cust_data = created_order
                
            c_first = cust_data.get("firstName") or cust_data.get("first_name") or "Customer"
            c_last = cust_data.get("lastName") or cust_data.get("last_name") or ""
            c_email = cust_data.get("email") or created_order.get("email") or ""
            
            # Extract Amount
            amount = created_order.get("totalAmount") or created_order.get("total_amount") or 0
        
        else:
            # Fallback: If it actually IS an object (Pydantic model)
            oid = str(created_order.id)
            if hasattr(created_order, "customer") and hasattr(created_order.customer, "firstName"):
                c_first = created_order.customer.firstName
                c_last = created_order.customer.lastName
                c_email = created_order.customer.email
            else:
                c_first = getattr(created_order, "first_name", "Customer")
                c_last = getattr(created_order, "last_name", "")
                c_email = getattr(created_order, "email", "")
            
            amount = getattr(created_order, "total_amount", 0)

        # ✅ Trigger Email Background Task
        background_tasks.add_task(
            send_admin_email_sync,
            order_id=oid,
            customer_name=f"{c_first} {c_last}", 
            amount=amount,
            customer_email=c_email
        )
        
        return created_order

    except (NotFoundException, ValidationException) as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=e.details if hasattr(e, "details") else str(e)
        )

# ... (Keep the rest of your endpoints: patch, customer, status) ...
@router.patch("/{order_id}/status", response_model=OrderResponse)
async def update_order_status(
    order_id: str,
    status_update: OrderStatusUpdate,
    usecase: OrderUseCase = Depends(get_order_usecase)
):
    try:
        return await usecase.update_order_status(order_id, status_update)
    except NotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ValidationException as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.details)

@router.get("/customer/{email}", response_model=List[OrderResponse])
async def get_customer_orders(
    email: str,
    usecase: OrderUseCase = Depends(get_order_usecase)
):
    try:
        return await usecase.get_orders_by_customer(email)
    except ValidationException as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.details)

@router.get("/status/{status}", response_model=List[OrderResponse])
async def get_orders_by_status(
    order_status: OrderStatus,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    usecase: OrderUseCase = Depends(get_order_usecase)
):
    try:
        return await usecase.get_orders_by_status(order_status, skip, limit)
    except ValidationException as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.details)