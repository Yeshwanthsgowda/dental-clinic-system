import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getDoctors,
  getDoctor,
  updateProfile,
  getDashboard,
  getAppointments,
  getReviews,
  getTreatments,
  addTreatment,
  updateTreatment,
  deleteTreatment,
  setSchedule,
  getMe,
  getSchedules,
  getScheduleOverrides,
  setScheduleOverride,
  deleteScheduleOverride
} from '../controllers/doctorController.js';

const router = express.Router();

// Public routes
router.get('/', getDoctors);

// Protected doctor routes (must come before /:id)
router.get('/me', protect, authorize('doctor'), getMe);
router.get('/schedules', protect, authorize('doctor'), getSchedules);
router.get('/dashboard', protect, authorize('doctor'), getDashboard);
router.get('/appointments', protect, authorize('doctor'), getAppointments);
router.get('/reviews', protect, authorize('doctor'), getReviews);
router.put('/profile', protect, authorize('doctor'), updateProfile);
router.put('/schedule', protect, authorize('doctor'), setSchedule);
router.get('/schedule-overrides', protect, authorize('doctor'), getScheduleOverrides);
router.post('/schedule-overrides', protect, authorize('doctor'), setScheduleOverride);
router.delete('/schedule-overrides/:id', protect, authorize('doctor'), deleteScheduleOverride);

// Treatment management
router.get('/treatments', protect, authorize('doctor'), getTreatments);
router.post('/treatments', protect, authorize('doctor'), addTreatment);
router.put('/treatments/:id', protect, authorize('doctor'), updateTreatment);
router.delete('/treatments/:id', protect, authorize('doctor'), deleteTreatment);

// Public route with ID param (must come last)
router.get('/:id', getDoctor);

export default router;