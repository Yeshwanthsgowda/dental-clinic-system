import prisma from '../config/database.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
export const getDoctors = asyncHandler(async (req, res) => {
  const doctors = await prisma.doctor.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      specialization: true,
      experience: true,
      fees: true,
      profilePic: true,
      createdAt: true,
      _count: {
        select: {
          appointments: true,
          reviews: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  res.json({
    success: true,
    count: doctors.length,
    data: doctors
  });
});

// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Public
export const getDoctor = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const doctor = await prisma.doctor.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      specialization: true,
      experience: true,
      fees: true,
      profilePic: true,
      createdAt: true,
      schedules: {
        select: {
          day: true,
          isOff: true,
          offSlots: true
        }
      },
      treatments: {
        select: {
          id: true,
          name: true,
          category: true,
          duration: true,
          price: true
        }
      },
      reviews: {
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          patient: {
            select: {
              name: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });

  if (!doctor) {
    return res.status(404).json({
      success: false,
      error: 'Doctor not found'
    });
  }

  res.json({
    success: true,
    data: doctor
  });
});

// @desc    Update doctor profile
// @route   PUT /api/doctors/profile
// @access  Private (Doctor only)
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, specialization, experience, description, fees, profilePic } = req.body;

  const doctor = await prisma.doctor.update({
    where: { id: req.user.id },
    data: {
      ...(name && { name }),
      ...(specialization && { specialization }),
      ...(experience && { experience: parseInt(experience) }),
      ...(description !== undefined && { description }),
      ...(fees && { fees: parseFloat(fees) }),
      ...(profilePic && { profilePic })
    },
    select: {
      id: true,
      name: true,
      email: true,
      specialization: true,
      experience: true,
      description: true,
      fees: true,
      profilePic: true,
      updatedAt: true
    }
  });

  res.json({
    success: true,
    data: doctor
  });
});

// @desc    Get current doctor profile
// @route   GET /api/doctors/me
// @access  Private (Doctor only)
export const getMe = asyncHandler(async (req, res) => {
  const doctor = await prisma.doctor.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      specialization: true,
      experience: true,
      fees: true,
      profilePic: true,
      schedules: {
        select: {
          id: true,
          day: true,
          isOff: true,
          startTime: true,
          endTime: true,
          offSlots: true
        }
      }
    }
  });

  res.json({
    success: true,
    data: doctor
  });
});

// @desc    Get doctor schedules
// @route   GET /api/doctors/schedules
// @access  Private (Doctor only)
export const getSchedules = asyncHandler(async (req, res) => {
  const schedules = await prisma.schedule.findMany({
    where: { doctorId: req.user.id },
    orderBy: { day: 'asc' }
  });

  res.json({
    success: true,
    data: schedules
  });
});

// @desc    Get doctor dashboard
// @route   GET /api/doctors/dashboard
// @access  Private (Doctor only)
export const getDashboard = asyncHandler(async (req, res) => {
  const doctorId = req.user.id;

  const [appointmentsCount, todayAppointments, totalPatients, avgRating, recentReviews] = await Promise.all([
    prisma.appointment.count({ where: { doctorId } }),
    prisma.appointment.findMany({
      where: {
        doctorId,
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999))
        }
      },
      include: {
        patient: { select: { name: true } },
        treatment: { select: { name: true } }
      },
      orderBy: { timeSlot: 'asc' }
    }),
    prisma.patient.count({
      where: {
        appointments: {
          some: { doctorId }
        }
      }
    }),
    prisma.review.aggregate({
      where: { doctorId },
      _avg: { rating: true }
    }),
    prisma.review.findMany({
      where: { doctorId },
      include: {
        patient: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })
  ]);

  res.json({
    success: true,
    data: {
      stats: {
        totalAppointments: appointmentsCount,
        totalPatients,
        averageRating: avgRating._avg.rating || 0,
        todayAppointments: todayAppointments.length
      },
      todayAppointments,
      recentReviews
    }
  });
});

// @desc    Get doctor appointments
// @route   GET /api/doctors/appointments
// @access  Private (Doctor only)
export const getAppointments = asyncHandler(async (req, res) => {
  const { status, date } = req.query;
  const doctorId = req.user.id;

  const where = { doctorId };
  if (status) where.status = status;
  if (date) {
    const startDate = new Date(date);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
    where.date = { gte: startDate, lt: endDate };
  }

  const appointments = await prisma.appointment.findMany({
    where,
    include: {
      patient: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true
        }
      },
      treatment: {
        select: {
          name: true,
          category: true,
          duration: true,
          price: true
        }
      }
    },
    orderBy: [
      { date: 'asc' },
      { timeSlot: 'asc' }
    ]
  });

  res.json({
    success: true,
    count: appointments.length,
    data: appointments
  });
});

// @desc    Get doctor reviews
// @route   GET /api/doctors/reviews
// @access  Private (Doctor only)
export const getReviews = asyncHandler(async (req, res) => {
  const doctorId = req.user.id;

  const reviews = await prisma.review.findMany({
    where: { doctorId },
    include: {
      patient: {
        select: {
          name: true,
          profilePic: true
        }
      },
      appointment: {
        select: {
          date: true,
          treatment: {
            select: {
              name: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const avgRating = await prisma.review.aggregate({
    where: { doctorId },
    _avg: { rating: true },
    _count: { rating: true }
  });

  res.json({
    success: true,
    data: {
      reviews,
      stats: {
        averageRating: avgRating._avg.rating || 0,
        totalReviews: avgRating._count.rating
      }
    }
  });
});

// @desc    Add treatment
// @route   POST /api/doctors/treatments
// @access  Private (Doctor only)
export const addTreatment = asyncHandler(async (req, res) => {
  const { name, description, category, duration, price } = req.body;
  const doctorId = req.user.id;

  const treatment = await prisma.treatment.create({
    data: {
      name,
      description,
      category,
      duration: parseInt(duration),
      price: parseFloat(price),
      doctorId
    }
  });

  res.status(201).json({
    success: true,
    data: treatment
  });
});

// @desc    Get doctor treatments
// @route   GET /api/doctors/treatments
// @access  Private (Doctor only)
export const getTreatments = asyncHandler(async (req, res) => {
  const doctorId = req.user.id;

  const treatments = await prisma.treatment.findMany({
    where: { doctorId },
    orderBy: {
      createdAt: 'desc'
    }
  });

  res.json({
    success: true,
    count: treatments.length,
    data: treatments
  });
});

// @desc    Update treatment
// @route   PUT /api/doctors/treatments/:id
// @access  Private (Doctor only)
export const updateTreatment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, category, duration, price } = req.body;
  const doctorId = req.user.id;

  const treatment = await prisma.treatment.update({
    where: {
      id,
      doctorId
    },
    data: {
      ...(name && { name }),
      ...(description && { description }),
      ...(category && { category }),
      ...(duration && { duration: parseInt(duration) }),
      ...(price && { price: parseFloat(price) })
    }
  });

  res.json({
    success: true,
    data: treatment
  });
});

// @desc    Delete treatment
// @route   DELETE /api/doctors/treatments/:id
// @access  Private (Doctor only)
export const deleteTreatment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const doctorId = req.user.id;

  await prisma.treatment.delete({
    where: {
      id,
      doctorId
    }
  });

  res.json({
    success: true,
    message: 'Treatment deleted successfully'
  });
});

// @desc    Get schedule overrides
// @route   GET /api/doctors/schedule-overrides
// @access  Private (Doctor only)
export const getScheduleOverrides = asyncHandler(async (req, res) => {
  const overrides = await prisma.scheduleOverride.findMany({
    where: { doctorId: req.user.id },
    orderBy: { date: 'asc' }
  });

  res.json({
    success: true,
    data: overrides
  });
});

// @desc    Add/Update schedule override
// @route   POST /api/doctors/schedule-overrides
// @access  Private (Doctor only)
export const setScheduleOverride = asyncHandler(async (req, res) => {
  const { date, isOff, startTime, endTime, offSlots } = req.body;
  const doctorId = req.user.id;

  const override = await prisma.scheduleOverride.upsert({
    where: {
      doctorId_date: {
        doctorId,
        date: new Date(date)
      }
    },
    update: {
      isOff: Boolean(isOff),
      startTime,
      endTime,
      offSlots: offSlots || []
    },
    create: {
      doctorId,
      date: new Date(date),
      isOff: Boolean(isOff),
      startTime,
      endTime,
      offSlots: offSlots || []
    }
  });

  res.json({
    success: true,
    data: override
  });
});

// @desc    Delete schedule override
// @route   DELETE /api/doctors/schedule-overrides/:id
// @access  Private (Doctor only)
export const deleteScheduleOverride = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const doctorId = req.user.id;

  await prisma.scheduleOverride.delete({
    where: {
      id,
      doctorId
    }
  });

  res.json({
    success: true,
    message: 'Schedule override deleted'
  });
});

// @desc    Set doctor schedule
// @route   PUT /api/doctors/schedule
// @access  Private (Doctor only)
export const setSchedule = asyncHandler(async (req, res) => {
  const { schedules } = req.body; // Array of { day, isOff, offSlots }
  const doctorId = req.user.id;

  const updatedSchedules = await Promise.all(
    schedules.map(async ({ day, isOff, offSlots }) => {
      return await prisma.schedule.upsert({
        where: {
          doctorId_day: {
            doctorId,
            day
          }
        },
        update: {
          isOff: Boolean(isOff),
          offSlots: offSlots || []
        },
        create: {
          doctorId,
          day,
          isOff: Boolean(isOff),
          offSlots: offSlots || []
        }
      });
    })
  );

  res.json({
    success: true,
    data: updatedSchedules
  });
});