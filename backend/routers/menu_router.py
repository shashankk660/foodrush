from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from auth import get_current_user, require_admin
import models, schemas

router = APIRouter(prefix="/api/menu", tags=["Menu"])

# ── Categories ────────────────────────────────
@router.get("/categories", response_model=List[schemas.CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).all()

@router.post("/categories", response_model=schemas.CategoryResponse, status_code=201)
def create_category(payload: schemas.CategoryCreate, db: Session = Depends(get_db),
                    _: models.User = Depends(require_admin)):
    cat = models.Category(**payload.dict())
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat

# ── Menu Items ────────────────────────────────
@router.get("/items", response_model=List[schemas.MenuItemResponse])
def get_menu_items(category_id: Optional[int] = None, vegetarian: Optional[bool] = None,
                   db: Session = Depends(get_db)):
    q = db.query(models.MenuItem).filter(models.MenuItem.is_available == True)
    if category_id:
        q = q.filter(models.MenuItem.category_id == category_id)
    if vegetarian is not None:
        q = q.filter(models.MenuItem.is_vegetarian == vegetarian)
    return q.all()

@router.get("/items/{item_id}", response_model=schemas.MenuItemResponse)
def get_menu_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.MenuItem).filter(models.MenuItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return item

@router.post("/items", response_model=schemas.MenuItemResponse, status_code=201)
def create_menu_item(payload: schemas.MenuItemCreate, db: Session = Depends(get_db),
                     _: models.User = Depends(require_admin)):
    if not db.query(models.Category).filter(models.Category.id == payload.category_id).first():
        raise HTTPException(status_code=404, detail="Category not found")
    item = models.MenuItem(**payload.dict())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.put("/items/{item_id}", response_model=schemas.MenuItemResponse)
def update_menu_item(item_id: int, payload: schemas.MenuItemUpdate, db: Session = Depends(get_db),
                     _: models.User = Depends(require_admin)):
    item = db.query(models.MenuItem).filter(models.MenuItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    for field, value in payload.dict(exclude_none=True).items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item

@router.delete("/items/{item_id}", status_code=204)
def delete_menu_item(item_id: int, db: Session = Depends(get_db),
                     _: models.User = Depends(require_admin)):
    item = db.query(models.MenuItem).filter(models.MenuItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    db.delete(item)
    db.commit()
