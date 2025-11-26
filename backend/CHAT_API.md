# Chat API Documentation

## Overview
AI-powered chatbot using Groq API with Llama 3 70B model for dental clinic assistance.

## Setup

### 1. Install Dependencies
```bash
npm install groq-sdk
```

### 2. Environment Variables
Add to `.env`:
```env
GROQ_API_KEY=your-groq-api-key-here
```

Get your API key from: https://console.groq.com/keys

### 3. Start Server
```bash
npm run dev
```

## API Endpoint

### POST /api/chat

**Description:** Send a message to the AI dental assistant chatbot

**Request:**
```json
{
  "message": "What services do you offer?"
}
```

**Response:**
```json
{
  "success": true,
  "reply": "We offer a wide range of dental services including general dentistry, cosmetic procedures, orthodontics, and emergency care. How can I help you today?"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Message is required"
}
```

## Features

- ✅ **Model:** llama3-70b-8192 (Fast and accurate)
- ✅ **System Prompt:** Friendly dental clinic assistant
- ✅ **Temperature:** 0.7 (Balanced creativity)
- ✅ **Max Tokens:** 1024 (Comprehensive responses)
- ✅ **ES Modules:** Modern JavaScript
- ✅ **Async/Await:** Clean error handling
- ✅ **Public Access:** No authentication required

## Usage Examples

### cURL
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What are your office hours?"}'
```

### JavaScript (Fetch)
```javascript
const response = await fetch('http://localhost:5000/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: 'How do I book an appointment?'
  })
});

const data = await response.json();
console.log(data.reply);
```

### Axios
```javascript
import axios from 'axios';

const { data } = await axios.post('http://localhost:5000/api/chat', {
  message: 'What dental treatments do you provide?'
});

console.log(data.reply);
```

## System Prompt
The chatbot is configured with:
> "You are a friendly dental clinic assistant chatbot."

This ensures responses are:
- Professional yet approachable
- Focused on dental clinic services
- Helpful and informative
- Patient-friendly language

## Error Handling

**Missing Message:**
- Status: 400
- Error: "Message is required"

**API Key Issues:**
- Status: 500
- Error: Groq API error message

**Network Issues:**
- Status: 500
- Error: Connection error details

## Rate Limiting
The chat endpoint is subject to the global rate limit:
- 100 requests per 15 minutes per IP

## Best Practices

1. **Validate Input:** Always send non-empty messages
2. **Handle Errors:** Check `success` field in response
3. **User Feedback:** Show loading state while waiting
4. **Retry Logic:** Implement exponential backoff for failures
5. **Context:** Keep conversation context on frontend if needed

## Integration with Frontend

```javascript
// React example
const [message, setMessage] = useState('');
const [reply, setReply] = useState('');
const [loading, setLoading] = useState(false);

const sendMessage = async () => {
  setLoading(true);
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    const data = await response.json();
    setReply(data.reply);
  } catch (error) {
    console.error('Chat error:', error);
  } finally {
    setLoading(false);
  }
};
```

## Testing

```bash
# Test the endpoint
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, I need help with booking an appointment"}'
```

Expected response:
```json
{
  "success": true,
  "reply": "Hello! I'd be happy to help you book an appointment. To get started, I'll need some information from you. What type of dental service are you looking for? We offer general checkups, cleanings, cosmetic procedures, and more."
}
```

## Notes

- The chatbot has no memory between requests
- For conversation history, maintain context on the frontend
- Responses are generated in real-time (typically 1-3 seconds)
- The model is optimized for speed and accuracy
- No authentication required for public access

## Troubleshooting

**"GROQ_API_KEY is not defined"**
- Ensure `.env` file has the API key
- Restart the server after adding the key

**"Model not found"**
- Verify model name: `llama3-70b-8192`
- Check Groq API status

**Slow responses**
- Normal for complex queries
- Consider reducing max_tokens if needed
- Check network connection

## Future Enhancements

- [ ] Add conversation history
- [ ] Implement streaming responses
- [ ] Add user authentication
- [ ] Store chat logs in database
- [ ] Add multi-language support
- [ ] Implement context-aware responses
