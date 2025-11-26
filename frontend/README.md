# DentalCare Frontend

Modern React application for dental clinic management with professional UI design.

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **ShadCN UI** - High-quality component library
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Lucide React** - Beautiful icons

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Update VITE_API_URL if needed
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/
│   ├── ui/              # ShadCN UI components
│   ├── layout/          # Layout components
│   ├── common/          # Reusable components
│   └── forms/           # Form components
├── pages/               # Page components
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # Dashboard pages
│   └── profile/        # Profile pages
├── context/            # React contexts
├── services/           # API services
├── hooks/              # Custom hooks
├── utils/              # Utility functions
└── lib/                # Library configurations
```

## Features

- ✅ **Modern UI Design** - Clean, professional SaaS-style interface
- ✅ **Responsive Layout** - Mobile-first responsive design
- ✅ **Authentication** - JWT-based auth with context management
- ✅ **API Integration** - Axios client with interceptors
- ✅ **Smooth Animations** - Framer Motion micro-interactions
- ✅ **Component Library** - ShadCN UI components
- ✅ **Type Safety** - PropTypes validation
- ✅ **Performance** - Optimized with Vite

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

- `VITE_API_URL` - Backend API URL (default: http://localhost:5000/api)