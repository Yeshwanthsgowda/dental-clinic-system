import prisma from '../config/database.js';
import { hashPassword } from '../utils/bcrypt.js';

async function seedUsers() {
  try {
    const hashedDoctorPassword = await hashPassword('doctor123');
    const doctor = await prisma.doctor.create({
      data: {
        name: 'Dr. John Smith',
        email: 'doctor@test.com',
        password: hashedDoctorPassword,
        specialization: 'General Dentistry',
        experience: 10,
        fees: 100,
      },
    });
    console.log('✅ Doctor created:', doctor.email);

    const hashedPatientPassword = await hashPassword('patient123');
    const patient = await prisma.patient.create({
      data: {
        name: 'Jane Doe',
        email: 'patient@test.com',
        password: hashedPatientPassword,
        phone: '1234567890',
      },
    });
    console.log('✅ Patient created:', patient.email);

    console.log('\n🎉 Test users created!');
    console.log('Doctor: doctor@test.com / doctor123');
    console.log('Patient: patient@test.com / patient123');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedUsers();
