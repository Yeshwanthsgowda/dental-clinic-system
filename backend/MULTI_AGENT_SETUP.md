# Multi-Agent AI System Setup

## Architecture

```
/ai
  /agents
    - ClinicAssistantAgent.js      (General inquiries)
    - AppointmentAgent.js          (Scheduling with tools)
    - TreatmentRecommenderAgent.js (Treatment info with tools)
  /tools
    - doctorTools.js               (4 tools: schedule, appointments, booking, treatments)
  /graphs
    - multiAgentGraph.js           (LangGraph routing logic)
  /prompts
    - clinicAssistant.js
    - appointment.js
    - treatmentRecommender.js
  - aiClient.js                    (Groq model factory)
  - index.js                       (Exports)
```

## Installation

```bash
npm install @langchain/groq @langchain/core langchain @langchain/langgraph zod
```

## Environment Variables

Add to `.env`:
```
GROQ_API_KEY=your_groq_api_key_here
```

## Agents

### 1. ClinicAssistantAgent
- **Purpose**: General clinic inquiries
- **Model**: llama3-70b-8192 (temp: 0.7)
- **Tools**: None (conversational only)
- **Use Cases**: Greetings, general info, routing

### 2. AppointmentAgent
- **Purpose**: Appointment scheduling
- **Model**: llama3-70b-8192 (temp: 0.5)
- **Tools**: getDoctorSchedule, getAppointments, bookAppointment
- **Use Cases**: Check availability, book appointments, view schedules

### 3. TreatmentRecommenderAgent
- **Purpose**: Treatment information
- **Model**: llama3-70b-8192 (temp: 0.6)
- **Tools**: getTreatments
- **Use Cases**: Treatment details, pricing, duration info

## Tools

All tools use Zod schemas for validation and Prisma for database access:

1. **getDoctorSchedule(doctorId)** - Fetch weekly schedule
2. **getAppointments(doctorId, date?)** - Get appointments
3. **bookAppointment(data)** - Create new appointment
4. **getTreatments(doctorId?)** - Fetch treatments

## Usage

### Basic Agent Usage

```javascript
import { ClinicAssistantAgent } from './ai/index.js';

const agent = new ClinicAssistantAgent();
const response = await agent.invoke('What services do you offer?');
console.log(response);
```

### Multi-Agent Graph Usage

```javascript
import { createMultiAgentGraph } from './ai/index.js';

const graph = createMultiAgentGraph();
const result = await graph.invoke({
  input: 'I want to book an appointment',
  history: [],
});
console.log(result.output);
```

## Routing Logic

The graph automatically routes queries based on keywords:
- **appointment/book/schedule** → AppointmentAgent
- **treatment/procedure/price** → TreatmentRecommenderAgent
- **default** → ClinicAssistantAgent

## Next Steps

1. Install dependencies: `npm install @langchain/groq @langchain/core langchain @langchain/langgraph zod`
2. Add GROQ_API_KEY to `.env`
3. Create API endpoint to use the multi-agent graph
4. Test each agent individually
5. Integrate with existing chat controller
6. Add conversation memory/history
7. Implement error handling and fallbacks
8. Add logging and monitoring
