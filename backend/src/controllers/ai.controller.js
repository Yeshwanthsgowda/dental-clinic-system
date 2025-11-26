import { TreatmentRecommenderAgent } from '../ai/agents/TreatmentRecommenderAgent.js';

const conversations = new Map();

export const agentChat = async (req, res) => {
  try {
    const { message, patientId, doctorId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const context = {};
    if (doctorId) context.doctorId = doctorId;
    if (patientId) context.patientId = patientId;

    console.log('Processing AI request:', message);
    const startTime = Date.now();

    // Directly use TreatmentRecommender for symptom analysis
    const agent = new TreatmentRecommenderAgent();
    const result = await agent.invoke(message, context);

    console.log(`AI processed in ${Date.now() - startTime}ms`);

    res.json({
      success: true,
      output: result.content,
      response: result.content,
      agentType: 'treatment',
      metadata: {
        recommendedTreatments: result.recommendedTreatments,
      },
    });
  } catch (error) {
    console.error('Agent Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process request',
      details: error.message,
    });
  }
};
