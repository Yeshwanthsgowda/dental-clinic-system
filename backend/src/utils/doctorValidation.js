import { body } from 'express-validator';

export const treatmentValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Treatment name must be at least 2 characters'),
  body('category').isIn(['CLEANING', 'FILLING', 'ROOT_CANAL', 'EXTRACTION', 'ORTHODONTICS', 'COSMETIC', 'SURGERY']).withMessage('Invalid treatment category'),
  body('duration').isInt({ min: 15, max: 480 }).withMessage('Duration must be between 15-480 minutes'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must be less than 500 characters')
];

export const scheduleValidation = [
  body('schedules').isArray({ min: 1 }).withMessage('Schedules must be an array'),
  body('schedules.*.day').isIn(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']).withMessage('Invalid day'),
  body('schedules.*.isOff').isBoolean().withMessage('isOff must be boolean'),
  body('schedules.*.offSlots').optional().isArray().withMessage('offSlots must be an array')
];

export const profileUpdateValidation = [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('specialization').optional().trim().isLength({ min: 2 }).withMessage('Specialization must be at least 2 characters'),
  body('experience').optional().isInt({ min: 0 }).withMessage('Experience must be a positive number'),
  body('fees').optional().isFloat({ min: 0 }).withMessage('Fees must be a positive number'),
  body('profilePic').optional().isURL().withMessage('Profile picture must be a valid URL')
];