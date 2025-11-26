import prisma from '../config/database.js';

export const createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, treatmentId, date, timeSlot, notes } = req.body;

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        treatmentId,
        date: new Date(date),
        timeSlot,
        notes,
        status: 'PENDING',
      },
      include: {
        patient: true,
        doctor: true,
        treatment: true,
      },
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ message: 'Failed to create appointment', error: error.message });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        patient: true,
        doctor: true,
        treatment: true,
        review: true,
      },
      orderBy: { date: 'desc' },
    });

    res.json(appointments);
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: true,
        doctor: true,
        treatment: true,
      },
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ message: 'Failed to fetch appointment', error: error.message });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, timeSlot, status, notes } = req.body;

    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        ...(date && { date: new Date(date) }),
        ...(timeSlot && { timeSlot }),
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
      },
      include: {
        patient: true,
        doctor: true,
        treatment: true,
      },
    });

    res.json(appointment);
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ message: 'Failed to update appointment', error: error.message });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.appointment.delete({
      where: { id },
    });

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({ message: 'Failed to delete appointment', error: error.message });
  }
};
