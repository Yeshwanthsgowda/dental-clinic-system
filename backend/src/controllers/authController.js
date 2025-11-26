import prisma from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.js';
import { generateToken } from '../utils/jwt.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Register doctor
// @route   POST /api/auth/register/doctor
// @access  Public
export const registerDoctor = asyncHandler(async (req, res) => {
  const { name, email, password, specialization, experience, fees } = req.body;

  // Check if doctor exists
  const existingDoctor = await prisma.doctor.findUnique({
    where: { email }
  });

  if (existingDoctor) {
    return res.status(400).json({
      success: false,
      error: 'Doctor already exists with this email'
    });
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create doctor
  const doctor = await prisma.doctor.create({
    data: {
      name,
      email,
      password: hashedPassword,
      specialization,
      experience: parseInt(experience),
      fees: parseFloat(fees)
    },
    select: {
      id: true,
      name: true,
      email: true,
      specialization: true,
      experience: true,
      fees: true,
      createdAt: true
    }
  });

  // Generate token
  const token = generateToken({
    id: doctor.id,
    role: 'doctor'
  });

  res.status(201).json({
    success: true,
    data: {
      user: doctor,
      token,
      role: 'doctor'
    }
  });
});

// @desc    Register patient
// @route   POST /api/auth/register/patient
// @access  Public
export const registerPatient = asyncHandler(async (req, res) => {
  const { name, email, password, phone, address } = req.body;
  
  console.log('Register Patient Request:', { name, email, phone, address });
  
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Name, email, and password are required'
    });
  }

  // Check if patient exists
  const existingPatient = await prisma.patient.findUnique({
    where: { email }
  });

  if (existingPatient) {
    return res.status(400).json({
      success: false,
      error: 'Patient already exists with this email'
    });
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create patient
  const patient = await prisma.patient.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone,
      address
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      createdAt: true
    }
  });

  // Generate token
  const token = generateToken({
    id: patient.id,
    role: 'patient'
  });

  res.status(201).json({
    success: true,
    data: {
      user: patient,
      token,
      role: 'patient'
    }
  });
});

// @desc    Login user (doctor or patient)
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check doctor first
  let user = await prisma.doctor.findUnique({
    where: { email }
  });

  let role = 'doctor';

  // If not doctor, check patient
  if (!user) {
    user = await prisma.patient.findUnique({
      where: { email }
    });
    role = 'patient';
  }

  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }

  // Check password
  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;

  // Generate token
  const token = generateToken({
    id: user.id,
    role
  });

  res.json({
    success: true,
    data: {
      user: userWithoutPassword,
      token,
      role
    }
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const { password: _, ...userWithoutPassword } = req.user;

  res.json({
    success: true,
    data: {
      user: userWithoutPassword,
      role: req.user.role
    }
  });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});