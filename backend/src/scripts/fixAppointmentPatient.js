import prisma from '../config/database.js';

async function fixAppointment() {
  try {
    // Get Jane Doe's ID (the seeded patient)
    const patient = await prisma.patient.findUnique({
      where: { email: 'patient@test.com' }
    });

    if (!patient) {
      console.log('Patient not found');
      return;
    }

    // Update the appointment to Jane Doe
    const appointment = await prisma.appointment.update({
      where: { id: 'cmi5zdq0c0001v2t2z17v4511' },
      data: { patientId: patient.id },
      include: {
        patient: true,
        doctor: true,
        treatment: true,
      },
    });

    console.log('\n✅ Appointment updated successfully!');
    console.log('========================');
    console.log(`ID: ${appointment.id}`);
    console.log(`Patient: ${appointment.patient.name} (${appointment.patient.email})`);
    console.log(`Doctor: ${appointment.doctor.name}`);
    console.log(`Treatment: ${appointment.treatment.name}`);
    console.log(`Status: ${appointment.status}`);
    console.log('========================\n');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixAppointment();
