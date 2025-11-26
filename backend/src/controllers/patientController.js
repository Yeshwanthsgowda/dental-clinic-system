import prisma from '../config/database.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private (Doctor only)
export const getPatients = asyncHandler(async (req, res) => {
  const patients = await prisma.patient.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      profilePic: true,
      createdAt: true,
      _count: {
        select: {
          appointments: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  res.json({
    success: true,
    count: patients.length,
    data: patients
  });
});

// @desc    Get single patient
// @route   GET /api/patients/:id
// @access  Private
export const getPatient = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check authorization
  if (req.user.role === 'patient' && req.user.id !== id) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to access this patient data'
    });
  }

  const patient = await prisma.patient.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      profilePic: true,
      createdAt: true,
      appointments: {
        select: {
          id: true,
          date: true,
          timeSlot: true,
          status: true,
          notes: true,
          doctor: {
            select: {
              name: true,
              specialization: true
            }
          },
          treatment: {
            select: {
              name: true,
              category: true,
              price: true
            }
          }
        },
        orderBy: {
          date: 'desc'
        }
      }
    }
  });

  if (!patient) {
    return res.status(404).json({
      success: false,
      error: 'Patient not found'
    });
  }

  res.json({
    success: true,
    data: patient
  });
});

// @desc    Update patient profile
// @route   PUT /api/patients/:id
// @access  Private (Patient only)
export const updatePatient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, phone, address, profilePic } = req.body;

  // Check if patient exists and user owns the profile
  if (req.user.id !== id || req.user.role !== 'patient') {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to update this profile'
    });
  }

  const patient = await prisma.patient.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(phone && { phone }),
      ...(address && { address }),
      ...(profilePic && { profilePic })
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      profilePic: true,
      updatedAt: true
    }
  });

  res.json({
    success: true,
    data: patient
  });
});