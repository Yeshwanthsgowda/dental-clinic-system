# 🚀 Complete Setup & Run Guide

## ⚠️ Prerequisites

Before running the project, ensure you have:

1. **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2. **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
3. **Groq API Key** - [Get Free Key](https://console.groq.com/)

---

## 📦 Step 1: Database Setup

### Option A: Using PostgreSQL Locally

1. **Install PostgreSQL** (if not installed)
2. **Create Database:**

```bash
# Open PostgreSQL command line (psql)
psql -U postgres

# Create database
CREATE DATABASE dental_clinic_db;

# Exit
\q
```

### Option B: Using Free Cloud PostgreSQL

Use services like:
- **Neon** (https://neon.tech) - Free tier
- **Supabase** (https://supabase.com) - Free tier
- **ElephantSQL** (https://www.elephantsql.com) - Free tier

---

## 🔧 Step 2: Backend Setup

### 1. Navigate to backend folder:
```bash
cd backend
```

### 2. Install dependencies (if not already installed):
```bash
npm install
```

### 3. Configure Environment Variables:

Edit `backend/.env` file:

```env
# Database - REPLACE WITH YOUR CREDENTIALS
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/dental_clinic_db?schema=public"

# JWT Secret - CHANGE THIS
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV="development"

# CORS
FRONTEND_URL="http://localhost:5173"

# Groq AI - GET YOUR KEY FROM https://console.groq.com/
GROQ_API_KEY="your-actual-groq-api-key-here"
```

**Example with local PostgreSQL:**
```env
DATABASE_URL="postgresql://postgres:password123@localhost:5432/dental_clinic_db?schema=public"
```

**Example with Neon (cloud):**
```env
DATABASE_URL="postgresql://user:pass@ep-cool-name-123456.us-east-2.aws.neon.tech/dental_clinic_db?sslmode=require"
```

### 4. Generate Prisma Client:
```bash
npm run generate
```

### 5. Run Database Migrations:
```bash
npm run migrate
```

When prompted, enter migration name: `init`

### 6. Start Backend Server:
```bash
npm run dev
```

✅ Backend should be running on **http://localhost:5000**

---

## 🎨 Step 3: Frontend Setup

### 1. Open NEW terminal and navigate to frontend:
```bash
cd frontend
```

### 2. Install dependencies (if not already installed):
```bash
npm install
```

### 3. Start Frontend Development Server:
```bash
npm run dev
```

✅ Frontend should be running on **http://localhost:5173**

---

## 🧪 Step 4: Verify Everything Works

### Backend Health Check:
Open browser: http://localhost:5000/health

Should see:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Frontend:
Open browser: http://localhost:5173

Should see the dental clinic homepage.

---

## 🎯 Quick Start Commands

### Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

### Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

---

## 🔑 Getting Groq API Key

1. Go to https://console.groq.com/
2. Sign up / Log in
3. Navigate to API Keys section
4. Create new API key
5. Copy and paste into `.env` file

**Free tier includes:**
- 14,400 requests per day
- Perfect for development

---

## 📊 Database Management

### View Database (Prisma Studio):
```bash
cd backend
npm run studio
```

Opens GUI at http://localhost:5555

### Reset Database:
```bash
cd backend
npx prisma migrate reset
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Port 5000 already in use"
**Solution:** Change PORT in `.env` to 5001 or kill process:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Issue 2: "Cannot connect to database"
**Solution:** 
- Check PostgreSQL is running
- Verify DATABASE_URL credentials
- Ensure database exists

### Issue 3: "Prisma Client not generated"
**Solution:**
```bash
cd backend
npm run generate
```

### Issue 4: "Module not found"
**Solution:**
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### Issue 5: "GROQ_API_KEY not found"
**Solution:**
- Get API key from https://console.groq.com/
- Add to `backend/.env`
- Restart backend server

---

## 📱 Access the Application

### Frontend URLs:
- **Home:** http://localhost:5173
- **Login:** http://localhost:5173/login
- **Register:** http://localhost:5173/register
- **AI Booking:** http://localhost:5173/ai-book-appointment
- **Doctors:** http://localhost:5173/doctors

### Backend API:
- **Base URL:** http://localhost:5000/api
- **Health:** http://localhost:5000/health
- **Auth:** http://localhost:5000/api/auth
- **AI Agent:** http://localhost:5000/api/ai/agent

---

## 🎨 Features to Test

### 1. **Register Account**
- Go to /register
- Choose Doctor or Patient
- Fill form and register

### 2. **Login**
- Go to /login
- Use registered credentials

### 3. **AI Chatbot**
- Click floating chat button (bottom-right)
- Ask questions about dental services
- See multi-agent responses with colored badges

### 4. **AI Appointment Booking**
- Go to /ai-book-appointment
- Describe symptoms
- Get AI treatment recommendations
- See available slots
- Book appointment

### 5. **Doctor Dashboard** (if logged in as doctor)
- View stats
- See today's appointments
- Manage treatments
- Update schedule

---

## 🛠️ Development Tools

### Backend:
- **Nodemon:** Auto-restart on file changes
- **Prisma Studio:** Database GUI
- **Morgan:** HTTP request logging

### Frontend:
- **Vite:** Fast HMR (Hot Module Replacement)
- **React DevTools:** Browser extension
- **Tailwind CSS:** Utility-first styling

---

## 📦 Project Structure

```
Project2/
├── backend/
│   ├── src/
│   │   ├── ai/              # Multi-agent AI system
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Auth, validation
│   │   ├── routes/          # API routes
│   │   └── utils/           # Helpers
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── .env                 # Environment variables
│   └── server.js            # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/      # Reusable components
    │   ├── pages/           # Page components
    │   ├── context/         # React context
    │   ├── services/        # API client
    │   └── styles/          # CSS files
    └── package.json
```

---

## ✅ Checklist Before Running

- [ ] Node.js installed
- [ ] PostgreSQL installed and running
- [ ] Database created
- [ ] Backend `.env` configured
- [ ] Groq API key added
- [ ] Backend dependencies installed (`npm install`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Prisma client generated (`npm run generate`)
- [ ] Database migrated (`npm run migrate`)

---

## 🚀 You're Ready!

Run both servers and access:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000

Enjoy your premium dental clinic management system with AI-powered features! 🦷✨
