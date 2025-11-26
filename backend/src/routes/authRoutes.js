import express from 'express';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middleware/validation.js';
import { protect } from '../middleware/auth.js';
import {
  registerDoctor,
  registerPatient,
  login,
  getMe,
  logout
} from '../controllers/authController.js';

const router = express.Router();

// Validation rules
const registerDoctorValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('specialization').trim().isLength({ min: 2 }).withMessage('Specialization is required'),
  body('experience').isInt({ min: 0 }).withMessage('Experience must be a positive number'),
  body('fees').isFloat({ min: 0 }).withMessage('Fees must be a positive number')
];

const registerPatientValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').optional({ nullable: true, checkFalsy: true }),
  body('address').optional({ nullable: true, checkFalsy: true })
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Routes
router.post('/register/doctor', registerDoctorValidation, handleValidationErrors, registerDoctor);
router.post('/register/patient', registerPatientValidation, handleValidationErrors, registerPatient);
router.post('/login', loginValidation, handleValidationErrors, login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;