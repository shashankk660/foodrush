from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from auth import get_current_user, require_admin
import models, schemas

router = APIRouter(prefix="/api/orders", tags=["Orders"])

@router.post("", response_model=schemas.OrderResponse, status_code=201)
def place_order(payload: schemas.OrderCreate, db: Session = Depends(get_db),
                current_user: models.User = Depends(get_current_user)):
    total = 0.0
    order_items = []
    for item_data in payload.items:
        menu_item = db.query(models.MenuItem).filter(
            models.MenuItem.id == item_data.menu_item_id,
            models.MenuItem.is_available == True
        ).first()
        if not menu_item:
            raise HTTPException(status_code=404, detail=f"Menu item {item_data.menu_item_id} not found or unavailable")
        subtotal = menu_item.price * item_data.quantity
        total += subtotal
        order_items.append(models.OrderItem(
            menu_item_id=item_data.menu_item_id,
            quantity=item_data.quantity,
            unit_price=menu_item.price
        ))

    order = models.Order(
        user_id=current_user.id,
        total_amount=round(total, 2),
        delivery_address=payload.delivery_address,
        special_instructions=payload.special_instructions,
    )
    db.add(order)
    db.flush()
    for oi in order_items:
        oi.order_id = order.id
        db.add(oi)
    db.commit()
    db.refresh(order)
    return order

@router.get("/my", response_model=List[schemas.OrderResponse])
def get_my_orders(db: Session = Depends(get_db),
                  current_user: models.User = Depends(get_current_user)):
    return db.query(models.Order).filter(models.Order.user_id == current_user.id)\
             .order_by(models.Order.created_at.desc()).all()

@router.get("/my/{order_id}", response_model=schemas.OrderResponse)
def get_my_order(order_id: int, db: Session = Depends(get_db),
                 current_user: models.User = Depends(get_current_user)):
    order = db.query(models.Order).filter(
        models.Order.id == order_id, models.Order.user_id == current_user.id
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

# ── Admin Routes ──────────────────────────────
@router.get("/all", response_model=List[schemas.OrderResponse])
def get_all_orders(db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    return db.query(models.Order).order_by(models.Order.created_at.desc()).all()

@router.put("/{order_id}/status", response_model=schemas.OrderResponse)
def update_order_status(order_id: int, payload: schemas.OrderStatusUpdate,
                        db: Session = Depends(get_db), _: models.User = Depends(require_admin)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = payload.status
    db.commit()
    db.refresh(order)
    return order
