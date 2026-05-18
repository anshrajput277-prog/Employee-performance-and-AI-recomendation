# ⚡ EmpAI — AI-Based Employee Performance Analytics & Recommendation System

> A full-stack MERN application that analyzes employee performance data and provides AI-powered recommendations using OpenRouter AI API.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

---

## 📌 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Screenshots](#screenshots)

---

## 🧠 Overview

**EmpAI** is a full-stack MERN application built for HR/Admin users to manage employee data, track performance metrics, and leverage AI to generate smart recommendations for promotions, training, and career growth.

The system integrates **OpenRouter AI API** (OpenAI-compatible) to deliver:
- Promotion eligibility analysis
- Performance-based employee ranking
- Personalized training suggestions
- AI-generated career feedback

---

## ✨ Features

### 👤 Employee Management
- ➕ Add new employees with full profile (name, email, department, skills, score, experience)
- 📋 View all employees sorted by performance score
- ✏️ Update performance scores inline
- 🗑️ Delete employees with confirmation
- 🔍 Advanced search & filter (by name, department, skill, score range)

### 🤖 AI Integration
- Single employee recommendation (promotion, ranking, training, feedback)
- Team-wide ranking with AI insights
- Powered by OpenRouter API (OpenAI-compatible)

### 🔐 Authentication & Security
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes on both frontend and backend
- Role-based access (Admin / HR)

### 📊 Dashboard
- Real-time stats (total employees, avg score, high performers)
- Top 5 performer leaderboard
- Quick action shortcuts

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, React Router v6 |
| **Styling** | Vanilla CSS (Glassmorphism + Dark Mode) |
| **HTTP Client** | Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas + Mongoose |
| **Auth** | JWT + bcryptjs |
| **Validation** | express-validator |
| **AI API** | OpenRouter (OpenAI-compatible) |
| **Deployment** | Render (backend) + Vercel (frontend) |

---

## 📁 Project Structure

```
ESE-FSD/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Login, Signup, Profile
│   │   ├── employeeController.js # CRUD + Search
│   │   └── aiController.js       # OpenRouter AI integration
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT protect + adminOnly
│   │   └── validateMiddleware.js # express-validator handler
│   ├── models/
│   │   ├── Employee.js           # Employee schema
│   │   └── User.js               # User schema (bcrypt)
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth
│   │   ├── employeeRoutes.js     # /api/employees
│   │   └── aiRoutes.js           # /api/ai
│   ├── .env                      # Environment variables
│   ├── package.json
│   └── server.js                 # Express entry point
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js          # Axios instance + JWT interceptor
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global auth state
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── EmployeeList.jsx
│   │   │   ├── AddEmployee.jsx
│   │   │   └── AIRecommendation.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🔗 API Endpoints

### 🔐 Auth APIs
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/auth/signup` | Register new HR/Admin user | Public |
| `POST` | `/api/auth/login` | Login and get JWT token | Public |
| `GET`  | `/api/auth/profile` | Get logged-in user profile | Protected |

### 👤 Employee APIs
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/employees` | Add new employee | Protected |
| `GET`  | `/api/employees` | Get all employees | Protected |
| `GET`  | `/api/employees/search?department=Development` | Search/filter employees | Protected |
| `GET`  | `/api/employees/:id` | Get employee by ID | Protected |
| `PUT`  | `/api/employees/:id` | Update employee | Protected |
| `DELETE` | `/api/employees/:id` | Delete employee | Protected |

### 🤖 AI APIs
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/ai/recommend` | AI recommendation for single employee | Protected |
| `POST` | `/api/ai/rank-all` | AI ranking of all employees | Protected |

---

### Sample Request — Add Employee
```json
POST /api/employees
Authorization: Bearer <token>

{
  "name": "Aman Verma",
  "email": "aman@gmail.com",
  "department": "Development",
  "skills": ["React", "Node.js", "MongoDB"],
  "performanceScore": 85,
  "experience": 3
}
```

### Sample Request — AI Recommend
```json
POST /api/ai/recommend
Authorization: Bearer <token>

{
  "employeeId": "664abc123..."
}
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- OpenRouter API key → [openrouter.ai](https://openrouter.ai)

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/ESE-FSD.git
cd ESE-FSD
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create `.env` file in `/backend`:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret_key
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=baidu/cobuddy-20260430:free
```

Start backend:
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## 🔑 Environment Variables

### Backend (`/backend/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `OPENROUTER_API_KEY` | API key from openrouter.ai |
| `OPENROUTER_MODEL` | AI model to use |
| `FRONTEND_URL` | Your Vercel frontend URL (for CORS) |

---

## ☁️ Deployment

### Backend → Render

1. Go to [render.com](https://render.com) → New Web Service
2. Connect GitHub repo
3. Set:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
4. Add all environment variables from `.env`
5. Deploy!

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import GitHub repo
3. Set:
   - **Root Directory:** `frontend`
   - **Framework Preset:** `Vite`
4. Add environment variable:
   - `VITE_API_URL` = your Render backend URL
5. Deploy!

---

## 📋 Database Test Cases

| Test Case | Expected Result |
|-----------|----------------|
| Insert valid employee | ✅ Employee stored successfully |
| Duplicate email | ❌ 409 Conflict error |
| Missing performance score | ❌ 400 Validation error |
| Search by department | ✅ Filtered employee list |

### Auth Test Cases

| Test Case | Expected Result |
|-----------|----------------|
| Valid login | ✅ JWT token generated |
| Invalid password | ❌ 401 Unauthorized |
| Access without token | ❌ 401 Access denied |
| Password in DB | ✅ Stored as bcrypt hash |

---

## 👨‍💻 Author

**Ansh Rajput**
- GitHub: [@anshrajput277](https://github.com/anshrajput277)
- Project: AI308B — Full Stack Development ESE

---

## 📄 License

This project is licensed under the MIT License.
