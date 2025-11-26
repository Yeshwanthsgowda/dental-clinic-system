import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());
app.use(morgan('combined'));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', (await import('./routes/authRoutes.js')).default);
app.use('/api/doctors', (await import('./routes/doctorRoutes.js')).default);
app.use('/api/patients', (await import('./routes/patientRoutes.js')).default);
app.use('/api/appointments', (await import('./routes/appointmentRoutes.js')).default);
app.use('/api/reviews', (await import('./routes/reviewRoutes.js')).default);
app.use('/api/chat', (await import('./routes/chatRoutes.js')).default);
app.use('/api/ai', (await import('./routes/ai.route.js')).default);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;