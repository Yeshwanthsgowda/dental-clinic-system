import { body } from 'express-validator';

export const doctorUpdateValidation = [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('specialization').optional().trim().isLength({ min: 2 }).withMessage('Specialization must be at least 2 characters'),
  body('experience').optional().isInt({ min: 0 }).withMessage('Experience must be a positive number'),
  body('fees').optional().isFloat({ min: 0 }).withMessage('Fees must be a positive number'),
  body('profilePic').optional().isURL().withMessage('Profile picture must be a valid URL')
];

export const patientUpdateValidation = [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
  body('address').optional().trim().isLength({ min: 5 }).withMessage('Address must be at least 5 characters'),
  body('profilePic').optional().isURL().withMessage('Profile picture must be a valid URL')
];