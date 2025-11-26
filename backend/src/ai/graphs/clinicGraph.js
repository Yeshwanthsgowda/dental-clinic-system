import { StateGraph, END } from '@langchain/langgraph';
import { ClinicAssistantAgent } from '../agents/ClinicAssistantAgent.js';
import { AppointmentAgent } from '../agents/AppointmentAgent.js';
import { TreatmentRecommenderAgent } from '../agents/TreatmentRecommenderAgent.js';

// State schema
const createInitialState = () => ({
  input: '',
  agentType: null,
  output: null,
  memory: [],
  context: {},
  metadata: {},
});

// Router node - determines which agent to use
const routerNode = (state) => {
  const input = state.input.toLowerCase();
  
  // Check for appointment-related keywords
  if (
    input.includes('appointment') ||
    input.includes('book') ||
    input.includes('schedule') ||
    input.includes('available') ||
    input.includes('slot')
  ) {
    return { ...state, agentType: 'appointment' };
  }
  
  // Check for treatment/symptom-related keywords
  if (
    input.includes('treatment') ||
    input.includes('pain') ||
    input.includes('symptom') ||
    input.includes('cavity') ||
    input.includes('tooth') ||
    input.includes('procedure') ||
    input.includes('price') ||
    input.includes('cost')
  ) {
    return { ...state, agentType: 'treatment' };
  }
  
  // Default to clinic assistant
  return { ...state, agentType: 'clinic' };
};

// Agent execution node
const agentExecutionNode = async (state) => {
  const { agentType, input, memory, context } = state;
  
  let result;
  
  try {
    if (agentType === 'appointment') {
      const agent = new AppointmentAgent();
      result = await agent.invoke(input, { ...context, history: memory });
    } else if (agentType === 'treatment') {
      const agent = new TreatmentRecommenderAgent();
      result = await agent.invoke(input, { ...context, history: memory });
    } else {
      const agent = new ClinicAssistantAgent();
      result = await agent.invoke(input, memory);
    }
    
    return {
      ...state,
      output: typeof result === 'string' ? result : result.content,
      metadata: typeof result === 'object' ? result : {},
    };
  } catch (error) {
    console.error('Agent Execution Error:', error);
    return {
      ...state,
      output: 'I apologize, but I encountered an error. Please try again or contact support.',
      metadata: { error: error.message },
    };
  }
};

// Memory node - stores last 5 messages
const memoryNode = (state) => {
  const { input, output, memory } = state;
  
  const newMemory = [
    ...memory,
    { role: 'user', content: input },
    { role: 'assistant', content: output },
  ];
  
  // Keep only last 5 messages (10 entries = 5 exchanges)
  const trimmedMemory = newMemory.slice(-10);
  
  return { ...state, memory: trimmedMemory };
};

// Output node - formats final response
const outputNode = (state) => {
  const { output, agentType, metadata, memory } = state;
  
  return {
    success: true,
    response: output,
    agent: agentType,
    metadata,
    conversationLength: memory.length / 2,
  };
};

// Create the graph
export const createClinicGraph = () => {
  const workflow = new StateGraph({
    channels: createInitialState(),
  });

  // Add nodes
  workflow.addNode('router', routerNode);
  workflow.addNode('agent', agentExecutionNode);
  workflow.addNode('memoryUpdate', memoryNode);
  workflow.addNode('formatter', outputNode);

  // Define edges
  workflow.addEdge('__start__', 'router');
  workflow.addEdge('router', 'agent');
  workflow.addEdge('agent', 'memoryUpdate');
  workflow.addEdge('memoryUpdate', 'formatter');
  workflow.addEdge('formatter', END);

  return workflow.compile();
};

// Helper function to invoke the graph
export const invokeClinicGraph = async (input, context = {}, memory = []) => {
  const graph = createClinicGraph();
  
  const result = await graph.invoke({
    input,
    context,
    memory,
    agentType: null,
    output: null,
    metadata: {},
  });
  
  return result;
};
