# Dental Clinic Management System

A full-stack web application for managing dental clinic operations with AI-powered chatbot assistance.

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Radix UI
- Framer Motion
- Axios

### Backend
- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT Authentication
- LangChain (AI Chatbot)

## Features

- 🔐 User Authentication (Patients & Doctors)
- 📅 Appointment Booking System
- 👨‍⚕️ Doctor Management
- 💬 AI-Powered Chatbot
- ⭐ Review System
- 📧 Email Notifications
- 🔒 Secure & Role-based Access

## Live Demo

- Frontend: [Your Vercel URL]
- Backend API: [Your Render URL]

## Local Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd Project2
```

2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your database URL
npx prisma migrate dev
npm run dev
```

3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Update .env with backend URL
npm run dev
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL=your_postgresql_url
JWT_SECRET=your_secret_key
GROQ_API_KEY=your_groq_key
PORT=5000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Deployment

- Frontend deployed on Vercel
- Backend deployed on Render
- Database hosted on Neon

## Author

Built as a college project demonstrating full-stack development skills.
