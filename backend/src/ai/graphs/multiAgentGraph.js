import { StateGraph, END } from '@langchain/langgraph';
import { ClinicAssistantAgent } from '../agents/ClinicAssistantAgent.js';
import { AppointmentAgent } from '../agents/AppointmentAgent.js';
import { TreatmentRecommenderAgent } from '../agents/TreatmentRecommenderAgent.js';

// Define state schema
const graphState = {
  input: null,
  agentType: null,
  output: null,
  history: [],
};

// Router function to determine which agent to use
const routeAgent = (state) => {
  const input = state.input.toLowerCase();
  
  if (input.includes('appointment') || input.includes('book') || input.includes('schedule')) {
    return 'appointment';
  }
  
  if (input.includes('treatment') || input.includes('procedure') || input.includes('price')) {
    return 'treatment';
  }
  
  return 'clinic';
};

// Agent nodes
const clinicNode = async (state) => {
  const agent = new ClinicAssistantAgent();
  const output = await agent.invoke(state.input);
  return { ...state, output, agentType: 'clinic' };
};

const appointmentNode = async (state) => {
  const agent = new AppointmentAgent();
  const output = await agent.invoke(state.input);
  return { ...state, output, agentType: 'appointment' };
};

const treatmentNode = async (state) => {
  const agent = new TreatmentRecommenderAgent();
  const output = await agent.invoke(state.input);
  return { ...state, output, agentType: 'treatment' };
};

// Create the graph
export const createMultiAgentGraph = () => {
  const workflow = new StateGraph({
    channels: graphState,
  });

  // Add nodes
  workflow.addNode('clinic', clinicNode);
  workflow.addNode('appointment', appointmentNode);
  workflow.addNode('treatment', treatmentNode);

  // Add conditional edges from START
  workflow.addConditionalEdges('__start__', routeAgent, {
    clinic: 'clinic',
    appointment: 'appointment',
    treatment: 'treatment',
  });

  // All nodes end after execution
  workflow.addEdge('clinic', END);
  workflow.addEdge('appointment', END);
  workflow.addEdge('treatment', END);

  return workflow.compile();
};
