import Groq from 'groq-sdk';
import { asyncHandler } from '../utils/asyncHandler.js';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// @desc    Chat with AI assistant
// @route   POST /api/chat
// @access  Public
export const chat = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      success: false,
      error: 'Message is required'
    });
  }

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'You are a friendly dental clinic assistant chatbot.'
      },
      {
        role: 'user',
        content: message
      }
    ],
    model: 'llama3-70b-8192',
    temperature: 0.7,
    max_tokens: 1024
  });

  const reply = chatCompletion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

  res.json({
    success: true,
    reply
  });
});
