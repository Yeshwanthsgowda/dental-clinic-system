import { invokeClinicGraph } from '../ai/index.js';

// In-memory conversation storage (use Redis in production)
const conversations = new Map();

export const aiChat = async (req, res) => {
  try {
    const { message, conversationId, doctorId, patientId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get or create conversation memory
    const convId = conversationId || `conv_${Date.now()}`;
    const memory = conversations.get(convId) || [];

    // Build context
    const context = {};
    if (doctorId) context.doctorId = doctorId;
    if (patientId) context.patientId = patientId;

    // Invoke the multi-agent graph
    const result = await invokeClinicGraph(message, context, memory);

    // Update conversation memory
    conversations.set(convId, result.metadata?.memory || memory);

    // Clean up old conversations (keep last 100)
    if (conversations.size > 100) {
      const firstKey = conversations.keys().next().value;
      conversations.delete(firstKey);
    }

    res.json({
      success: true,
      response: result.response,
      agent: result.agent,
      conversationId: convId,
      metadata: result.metadata,
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({
      error: 'Failed to process message',
      details: error.message,
    });
  }
};

export const clearConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    if (conversations.has(conversationId)) {
      conversations.delete(conversationId);
      return res.json({ success: true, message: 'Conversation cleared' });
    }
    
    res.status(404).json({ error: 'Conversation not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
