from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from models import UserRole, OrderStatus

# ── Auth ──────────────────────────────────────
class UserRegister(BaseModel):
    name: str = Field(..., min_length=2)
    email: EmailStr
    password: str = Field(..., min_length=6)
    phone: Optional[str] = None
    address: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    email: Optional[str] = None

# ── User ──────────────────────────────────────
class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str]
    address: Optional[str]
    role: UserRole
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

# ── Category ──────────────────────────────────
class CategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None

class CategoryResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    image_url: Optional[str]

    class Config:
        from_attributes = True

# ── Menu Item ─────────────────────────────────
class MenuItemCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float = Field(..., gt=0)
    image_url: Optional[str] = None
    is_available: bool = True
    is_vegetarian: bool = False
    rating: float = Field(4.0, ge=0, le=5)
    prep_time_minutes: int = 20
    category_id: int

class MenuItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    image_url: Optional[str] = None
    is_available: Optional[bool] = None
    is_vegetarian: Optional[bool] = None
    rating: Optional[float] = None
    prep_time_minutes: Optional[int] = None
    category_id: Optional[int] = None

class MenuItemResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    price: float
    image_url: Optional[str]
    is_available: bool
    is_vegetarian: bool
    rating: float
    prep_time_minutes: int
    category_id: int
    category: Optional[CategoryResponse]
    created_at: datetime

    class Config:
        from_attributes = True

# ── Order ─────────────────────────────────────
class OrderItemCreate(BaseModel):
    menu_item_id: int
    quantity: int = Field(..., gt=0)

class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    delivery_address: str
    special_instructions: Optional[str] = None

class OrderItemResponse(BaseModel):
    id: int
    menu_item_id: int
    quantity: int
    unit_price: float
    menu_item: Optional[MenuItemResponse]

    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    user_id: int
    status: OrderStatus
    total_amount: float
    delivery_address: str
    special_instructions: Optional[str]
    items: List[OrderItemResponse]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class OrderStatusUpdate(BaseModel):
    status: OrderStatus
