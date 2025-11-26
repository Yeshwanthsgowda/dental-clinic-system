import { createGroqModel, formatMessages } from '../aiClient.js';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import { getScheduleAndAppointmentsTool, bookAppointmentTool } from '../tools/doctorTools.js';

const APPOINTMENT_PROMPT = `You are an appointment scheduling specialist for a dental clinic.

Your tasks:
1. Check doctor availability using getScheduleAndAppointments tool
2. Recommend the next available slot to the patient
3. Book appointments using bookAppointment tool when patient confirms
4. Always confirm details before booking

Be helpful and clear about available time slots.`;

export class AppointmentAgent {
  constructor() {
    this.model = createGroqModel(0.5);
    this.tools = [getScheduleAndAppointmentsTool, bookAppointmentTool];
  }

  async invoke(input, context = {}) {
    const { doctorId, patientId, history = [] } = context;
    
    // First, get available slots
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    let availabilityData = null;
    if (doctorId) {
      const result = await getScheduleAndAppointmentsTool.func({
        doctorId,
        startDate: today.toISOString(),
        endDate: nextWeek.toISOString(),
      });
      availabilityData = JSON.parse(result);
    }

    const messages = [
      new SystemMessage(APPOINTMENT_PROMPT),
      ...formatMessages(history),
    ];

    if (availabilityData) {
      messages.push(new SystemMessage(`Available slots: ${JSON.stringify(availabilityData.availableSlots)}`));
    }

    messages.push(new HumanMessage(input));

    const response = await this.model.invoke(messages);
    
    return {
      content: response.content,
      availableSlots: availabilityData?.availableSlots || [],
    };
  }

  async bookAppointment(data) {
    const result = await bookAppointmentTool.func(data);
    return JSON.parse(result);
  }
}
