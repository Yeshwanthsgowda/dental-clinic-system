# Dental Clinic Backend

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Update .env with your database credentials
   ```

3. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run generate
   
   # Run migrations
   npm run migrate
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── config/          # Database and app configuration
├── controllers/     # Route handlers
├── middleware/      # Custom middleware
├── models/          # Business logic
├── routes/          # API routes
├── services/        # External services
└── utils/           # Helper functions
```

## API Endpoints

- `POST /api/auth/register/doctor` - Doctor registration
- `POST /api/auth/register/patient` - Patient registration
- `POST /api/auth/login` - User login
- `GET /api/doctors` - Get all doctors
- `GET /api/patients` - Get all patients
- `GET /api/appointments` - Get appointments

## Features

- ✅ ES Modules
- ✅ JWT Authentication
- ✅ Password Hashing
- ✅ Input Validation
- ✅ Error Handling
- ✅ Rate Limiting
- ✅ CORS Protection
- ✅ Security Headers