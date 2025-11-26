import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from '../controllers/appointmentController.js';

const router = express.Router();

router.get('/', protect, getAppointments);
router.post('/', protect, createAppointment);
router.get('/:id', protect, getAppointmentById);
router.put('/:id', protect, updateAppointment);
router.delete('/:id', protect, deleteAppointment);

export default router;