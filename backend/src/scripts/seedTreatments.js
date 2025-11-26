import prisma from '../config/database.js';

async function seedTreatments() {
  try {
    // Get the first doctor
    const doctor = await prisma.doctor.findFirst();
    
    if (!doctor) {
      console.log('❌ No doctor found. Please create a doctor first.');
      return;
    }

    const treatments = [
      {
        name: 'Dental Cleaning',
        description: 'Professional teeth cleaning and plaque removal',
        category: 'CLEANING',
        duration: 30,
        price: 100,
        doctorId: doctor.id,
      },
      {
        name: 'Tooth Filling',
        description: 'Cavity filling with composite resin',
        category: 'FILLING',
        duration: 45,
        price: 200,
        doctorId: doctor.id,
      },
      {
        name: 'Root Canal Treatment',
        description: 'Root canal therapy for infected tooth',
        category: 'ROOT_CANAL',
        duration: 90,
        price: 800,
        doctorId: doctor.id,
      },
      {
        name: 'Tooth Extraction',
        description: 'Surgical removal of damaged tooth',
        category: 'EXTRACTION',
        duration: 60,
        price: 300,
        doctorId: doctor.id,
      },
      {
        name: 'Teeth Whitening',
        description: 'Professional teeth whitening treatment',
        category: 'COSMETIC',
        duration: 60,
        price: 400,
        doctorId: doctor.id,
      },
    ];

    for (const treatment of treatments) {
      await prisma.treatment.create({ data: treatment });
      console.log(`✅ Created: ${treatment.name}`);
    }

    console.log('\n🎉 Treatments seeded successfully!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedTreatments();
