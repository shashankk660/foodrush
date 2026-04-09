# 🍔 FoodRush — Full Stack Food Delivery App

> A production-grade full stack web application built with **React + Vite** (frontend) and **FastAPI** (backend), featuring JWT authentication, CRUD operations, protected routes, and a real food delivery business workflow.

---

## 🏗️ Project Structure

```
foodrush/
├── frontend/               # React + Vite + JavaScript
│   ├── .env                # Frontend environment variables
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── App.jsx         # Main router
│       ├── main.jsx
│       ├── api/
│       │   └── axios.js    # Axios instance + interceptors
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   └── CartContext.jsx
│       ├── components/
│       │   ├── Navbar.jsx / .css
│       │   ├── ProtectedRoute.jsx
│       │   └── MenuItemCard.jsx / .css
│       ├── pages/
│       │   ├── Home.jsx / .css
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Auth.css    (shared)
│       │   ├── Menu.jsx / .css
│       │   ├── Cart.jsx / .css
│       │   ├── Orders.jsx / .css
│       │   ├── Profile.jsx / .css
│       │   └── Admin.jsx / .css
│       └── styles/
│           └── global.css
│
└── backend/                # FastAPI + SQLite + JWT
    ├── .env                # Backend environment variables
    ├── requirements.txt
    ├── main.py             # FastAPI app entry point
    ├── config.py           # Pydantic settings (reads .env)
    ├── database.py         # SQLAlchemy engine + session
    ├── models.py           # ORM models
    ├── schemas.py          # Pydantic request/response schemas
    ├── auth.py             # JWT create/verify, password hashing
    ├── seed.py             # Seeds DB with categories + menu items
    └── routers/
        ├── auth_router.py  # /api/auth/*
        ├── menu_router.py  # /api/menu/*
        └── orders_router.py# /api/orders/*
```

---

## ⚙️ Environment Variables

### `backend/.env`
| Variable | Description |
|---|---|
| `APP_TITLE` | API title shown in Swagger |
| `SECRET_KEY` | JWT signing secret |
| `ALGORITHM` | JWT algorithm (HS256) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token lifetime |
| `DATABASE_URL` | SQLite path |
| `FRONTEND_ORIGIN` | CORS allowed origin |
| `ADMIN_EMAIL / PASSWORD / NAME` | Seeded admin credentials |

### `frontend/.env`
| Variable | Description |
|---|---|
| `VITE_APP_TITLE` | App display name |
| `VITE_APP_TAGLINE` | Hero tagline |
| `VITE_API_BASE_URL` | Backend URL |
| `VITE_APP_CURRENCY` | Currency symbol |
| `VITE_DELIVERY_FEE` | Flat delivery fee |
| `VITE_FREE_DELIVERY_ABOVE` | Free delivery threshold |

---

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Seed the database (creates tables + sample data + admin user)
python seed.py

# Start the server
uvicorn main:app --reload --port 8000
```

Backend runs at: **http://localhost:8000**  
Swagger docs at: **http://localhost:8000/docs**

---

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## 🔐 Authentication Flow

1. User registers → password bcrypt-hashed → stored in SQLite
2. User logs in → JWT token issued (HS256, 60 min expiry)
3. Token stored in `localStorage` as `fr_token`
4. Axios interceptor attaches `Authorization: Bearer <token>` to every request
5. 401 responses auto-redirect to `/login` and clear storage
6. Backend `get_current_user` dependency validates token on protected routes
7. `require_admin` dependency enforces admin-only routes

---

## 📋 API Endpoints

### Auth — `/api/auth`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/register` | ❌ | Register new user |
| POST | `/login` | ❌ | Login, get JWT token |
| GET | `/me` | ✅ | Get current user |
| PUT | `/me` | ✅ | Update profile |

### Menu — `/api/menu`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/categories` | ❌ | List categories |
| POST | `/categories` | 👑 Admin | Create category |
| GET | `/items` | ❌ | List menu items (filterable) |
| GET | `/items/{id}` | ❌ | Get single item |
| POST | `/items` | 👑 Admin | Create menu item |
| PUT | `/items/{id}` | 👑 Admin | Update menu item |
| DELETE | `/items/{id}` | 👑 Admin | Delete menu item |

### Orders — `/api/orders`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/` | ✅ | Place new order |
| GET | `/my` | ✅ | User's orders |
| GET | `/my/{id}` | ✅ | Single order detail |
| GET | `/all` | 👑 Admin | All orders |
| PUT | `/{id}/status` | 👑 Admin | Update order status |

---

## 🎯 Features

- ✅ JWT authentication with protected routes
- ✅ Role-based access (User / Admin)
- ✅ Full CRUD on menu items (admin)
- ✅ Order placement with cart management
- ✅ Order status tracking with progress bar
- ✅ Admin dashboard with stats + order management
- ✅ Vegetarian filter, category filter, search
- ✅ Responsive design (mobile-friendly)
- ✅ ENV-driven configuration throughout
- ✅ Automatic DB table creation on startup
- ✅ Global error handling + toast notifications

---

## 🔑 Demo Credentials

```
Admin:  admin@foodrush.com  /  Admin@1234
```

Register a new account for regular user access.
