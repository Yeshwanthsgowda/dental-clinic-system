import prisma from '../config/database.js';

async function checkDoctors() {
  try {
    const doctors = await prisma.doctor.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        specialization: true,
      },
    });

    console.log('\n📋 Doctors in database:');
    console.log('========================');
    doctors.forEach((doc, index) => {
      console.log(`\n${index + 1}. ${doc.name}`);
      console.log(`   Email: ${doc.email}`);
      console.log(`   Specialization: ${doc.specialization}`);
      console.log(`   ID: ${doc.id}`);
    });
    console.log('\n========================\n');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDoctors();
