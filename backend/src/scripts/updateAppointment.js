import prisma from '../config/database.js';

async function updateAppointment() {
  try {
    const appointment = await prisma.appointment.update({
      where: { id: 'cmi65hccb00016s4oc0st8bbh' },
      data: { status: 'COMPLETED' },
      include: {
        patient: true,
        doctor: true,
        treatment: true,
      },
    });

    console.log('\n✅ Appointment updated successfully!');
    console.log('========================');
    console.log(`ID: ${appointment.id}`);
    console.log(`Patient: ${appointment.patient.name}`);
    console.log(`Doctor: ${appointment.doctor.name}`);
    console.log(`Treatment: ${appointment.treatment.name}`);
    console.log(`Date: ${appointment.date}`);
    console.log(`Time: ${appointment.timeSlot}`);
    console.log(`Status: ${appointment.status}`);
    console.log('========================\n');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateAppointment();
