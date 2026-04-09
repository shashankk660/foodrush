"""Run once to seed the database with sample data."""
from database import SessionLocal, engine
import models
from auth import hash_password
from config import settings

models.Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Admin user
if not db.query(models.User).filter(models.User.email == settings.ADMIN_EMAIL).first():
    admin = models.User(
        name=settings.ADMIN_NAME,
        email=settings.ADMIN_EMAIL,
        hashed_password=hash_password(settings.ADMIN_PASSWORD),
        role=models.UserRole.admin,
    )
    db.add(admin)
    db.commit()
    print(f"✅ Admin created: {settings.ADMIN_EMAIL}")

# Categories
cats_data = [
    {"name": "Burgers", "description": "Juicy handcrafted burgers", "image_url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400"},
    {"name": "Pizza", "description": "Wood-fired artisan pizzas", "image_url": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400"},
    {"name": "Sushi", "description": "Fresh premium sushi rolls", "image_url": "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400"},
    {"name": "Desserts", "description": "Heavenly sweet treats", "image_url": "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400"},
    {"name": "Drinks", "description": "Refreshing beverages", "image_url": "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400"},
]

cats = {}
for c in cats_data:
    existing = db.query(models.Category).filter(models.Category.name == c["name"]).first()
    if not existing:
        cat = models.Category(**c)
        db.add(cat)
        db.commit()
        db.refresh(cat)
        cats[c["name"]] = cat.id
        print(f"✅ Category: {c['name']}")
    else:
        cats[c["name"]] = existing.id

# Menu Items
items_data = [
    {"name": "Classic Smash Burger", "description": "Double smash patty, American cheese, pickles, special sauce", "price": 12.99, "category_id": cats["Burgers"], "is_vegetarian": False, "rating": 4.8, "prep_time_minutes": 15, "image_url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400"},
    {"name": "BBQ Bacon Burger", "description": "Smoky BBQ sauce, crispy bacon, onion rings, cheddar", "price": 14.99, "category_id": cats["Burgers"], "is_vegetarian": False, "rating": 4.7, "prep_time_minutes": 18, "image_url": "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400"},
    {"name": "Veggie Deluxe Burger", "description": "Beyond patty, avocado, lettuce, tomato, vegan mayo", "price": 13.49, "category_id": cats["Burgers"], "is_vegetarian": True, "rating": 4.5, "prep_time_minutes": 15, "image_url": "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400"},
    {"name": "Margherita Pizza", "description": "San Marzano tomato, buffalo mozzarella, fresh basil", "price": 13.99, "category_id": cats["Pizza"], "is_vegetarian": True, "rating": 4.9, "prep_time_minutes": 25, "image_url": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400"},
    {"name": "Pepperoni Feast", "description": "Double pepperoni, mozzarella, tomato base", "price": 15.99, "category_id": cats["Pizza"], "is_vegetarian": False, "rating": 4.8, "prep_time_minutes": 25, "image_url": "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400"},
    {"name": "BBQ Chicken Pizza", "description": "Pulled chicken, BBQ sauce, red onion, cilantro", "price": 16.99, "category_id": cats["Pizza"], "is_vegetarian": False, "rating": 4.6, "prep_time_minutes": 28, "image_url": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400"},
    {"name": "Dragon Roll", "description": "Shrimp tempura, avocado, unagi sauce, tobiko", "price": 17.99, "category_id": cats["Sushi"], "is_vegetarian": False, "rating": 4.9, "prep_time_minutes": 20, "image_url": "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400"},
    {"name": "Rainbow Roll", "description": "Crab, cucumber, tuna, salmon, avocado", "price": 19.99, "category_id": cats["Sushi"], "is_vegetarian": False, "rating": 4.8, "prep_time_minutes": 20, "image_url": "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400"},
    {"name": "Volcano Roll", "description": "Spicy tuna, cream cheese, jalapeño, baked topping", "price": 18.99, "category_id": cats["Sushi"], "is_vegetarian": False, "rating": 4.7, "prep_time_minutes": 22, "image_url": "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400"},
    {"name": "Chocolate Lava Cake", "description": "Warm chocolate cake with molten center, vanilla ice cream", "price": 8.99, "category_id": cats["Desserts"], "is_vegetarian": True, "rating": 4.9, "prep_time_minutes": 12, "image_url": "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400"},
    {"name": "New York Cheesecake", "description": "Classic creamy cheesecake with berry compote", "price": 7.99, "category_id": cats["Desserts"], "is_vegetarian": True, "rating": 4.8, "prep_time_minutes": 5, "image_url": "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400"},
    {"name": "Mango Sorbet", "description": "Fresh mango sorbet, mint, chili lime dust", "price": 6.49, "category_id": cats["Desserts"], "is_vegetarian": True, "rating": 4.6, "prep_time_minutes": 3, "image_url": "https://images.unsplash.com/photo-1488900128323-21503983a07e?w=400"},
    {"name": "Craft Lemonade", "description": "Fresh squeezed lemonade with basil and mint", "price": 4.99, "category_id": cats["Drinks"], "is_vegetarian": True, "rating": 4.7, "prep_time_minutes": 3, "image_url": "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400"},
    {"name": "Mango Lassi", "description": "Thick mango yoghurt shake with cardamom", "price": 5.49, "category_id": cats["Drinks"], "is_vegetarian": True, "rating": 4.8, "prep_time_minutes": 3, "image_url": "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400"},
]

for item_data in items_data:
    if not db.query(models.MenuItem).filter(models.MenuItem.name == item_data["name"]).first():
        item = models.MenuItem(**item_data)
        db.add(item)
        db.commit()
        print(f"✅ Item: {item_data['name']}")

db.close()
print("\n🚀 Database seeded successfully!")
print(f"Admin login → {settings.ADMIN_EMAIL} / {settings.ADMIN_PASSWORD}")
