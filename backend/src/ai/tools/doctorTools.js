import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import prisma from '../../config/database.js';

export const getScheduleAndAppointmentsTool = new DynamicStructuredTool({
  name: 'getScheduleAndAppointments',
  description: 'Get doctor schedule and existing appointments to find available slots',
  schema: z.object({
    doctorId: z.string().describe('The ID of the doctor'),
    startDate: z.string().describe('Start date to check (ISO format)'),
    endDate: z.string().describe('End date to check (ISO format)'),
  }),
  func: async ({ doctorId, startDate, endDate }) => {
    const schedules = await prisma.schedule.findMany({
      where: { doctorId, isOff: false },
      include: { doctor: { select: { name: true, specialization: true } } },
    });

    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        date: { gte: new Date(startDate), lte: new Date(endDate) },
        status: { not: 'CANCELLED' },
      },
      select: { date: true, timeSlot: true },
    });

    const availableSlots = [];
    const timeSlots = ['09:00-10:00', '10:00-11:00', '11:00-12:00', '14:00-15:00', '15:00-16:00', '16:00-17:00'];
    
    const current = new Date(startDate);
    const end = new Date(endDate);
    
    while (current <= end) {
      const dayName = current.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
      const daySchedule = schedules.find(s => s.day === dayName);
      
      if (daySchedule) {
        const dateStr = current.toISOString().split('T')[0];
        const bookedSlots = appointments
          .filter(a => a.date.toISOString().split('T')[0] === dateStr)
          .map(a => a.timeSlot);
        
        timeSlots.forEach(slot => {
          if (!bookedSlots.includes(slot) && !daySchedule.offSlots.includes(slot)) {
            availableSlots.push({ date: dateStr, timeSlot: slot });
          }
        });
      }
      
      current.setDate(current.getDate() + 1);
    }

    return JSON.stringify({ schedules, availableSlots: availableSlots.slice(0, 10) });
  },
});

export const bookAppointmentTool = new DynamicStructuredTool({
  name: 'bookAppointment',
  description: 'Book a new appointment for a patient with a doctor at a specific date and time',
  schema: z.object({
    patientId: z.string().describe('The ID of the patient'),
    doctorId: z.string().describe('The ID of the doctor'),
    treatmentId: z.string().describe('The ID of the treatment'),
    date: z.string().describe('Appointment date (YYYY-MM-DD format)'),
    timeSlot: z.string().describe('Time slot (e.g., "09:00-10:00")'),
    notes: z.string().optional().describe('Optional notes'),
  }),
  func: async (data) => {
    try {
      const appointment = await prisma.appointment.create({
        data: {
          ...data,
          date: new Date(data.date),
        },
        include: {
          doctor: { select: { name: true, specialization: true } },
          treatment: { select: { name: true, price: true, duration: true } },
        },
      });
      return JSON.stringify({ success: true, appointment });
    } catch (error) {
      return JSON.stringify({ success: false, error: error.message });
    }
  },
});

export const getTreatmentsTool = new DynamicStructuredTool({
  name: 'getTreatments',
  description: 'Get all available treatments with descriptions to match patient symptoms',
  schema: z.object({
    doctorId: z.string().optional().describe('Optional doctor ID to filter treatments'),
  }),
  func: async ({ doctorId }) => {
    const where = doctorId ? { doctorId } : {};
    const treatments = await prisma.treatment.findMany({
      where,
      include: { doctor: { select: { name: true, specialization: true } } },
    });
    return JSON.stringify(treatments);
  },
});
