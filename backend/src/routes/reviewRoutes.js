import express from 'express';
import { protect } from '../middleware/auth.js';
import prisma from '../config/database.js';

const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const { appointmentId, rating, comment } = req.body;

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment || appointment.patientId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const review = await prisma.review.create({
      data: {
        appointmentId,
        doctorId: appointment.doctorId,
        patientId: req.user.id,
        rating,
        comment,
      },
    });

    res.json(review);
  } catch (error) {
    console.error('Review creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
