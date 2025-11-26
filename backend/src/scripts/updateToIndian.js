import prisma from '../config/database.js';
import { hashPassword } from '../utils/bcrypt.js';

async function updateToIndian() {
  try {
    // Update doctor name and fees
    const doctor = await prisma.doctor.update({
      where: { email: 'doctor@test.com' },
      data: {
        name: 'Dr. Rajesh Kumar',
        fees: 500, // ₹500
        specialization: 'General & Cosmetic Dentistry'
      }
    });
    console.log('✅ Doctor updated:', doctor.name);

    // Update patient name
    const patient = await prisma.patient.update({
      where: { email: 'patient@test.com' },
      data: {
        name: 'Priya Sharma'
      }
    });
    console.log('✅ Patient updated:', patient.name);

    // Update treatment prices
    const treatments = await prisma.treatment.findMany({
      where: { doctorId: doctor.id }
    });

    for (const treatment of treatments) {
      let newPrice;
      switch (treatment.name) {
        case 'Dental Cleaning':
          newPrice = 800;
          break;
        case 'Tooth Filling':
          newPrice = 1200;
          break;
        case 'Root Canal':
          newPrice = 3500;
          break;
        case 'Tooth Extraction':
          newPrice = 1500;
          break;
        case 'Teeth Whitening':
          newPrice = 5000;
          break;
        default:
          newPrice = treatment.price * 80; // Convert $ to ₹ (approx)
      }

      await prisma.treatment.update({
        where: { id: treatment.id },
        data: { price: newPrice }
      });
      console.log(`✅ Treatment updated: ${treatment.name} - ₹${newPrice}`);
    }

    console.log('\n🎉 All updates completed successfully!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateToIndian();
