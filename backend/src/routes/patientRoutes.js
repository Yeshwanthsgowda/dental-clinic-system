import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getPatients,
  getPatient,
  updatePatient
} from '../controllers/patientController.js';

const router = express.Router();

router.get('/', protect, authorize('doctor'), getPatients);
router.get('/:id', protect, getPatient);
router.put('/:id', protect, authorize('patient'), updatePatient);

export default router;