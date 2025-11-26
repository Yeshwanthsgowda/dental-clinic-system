# Chatbot Widget Documentation

## Overview
Premium floating chatbot widget with modern SaaS design, powered by Groq AI (Llama 3 70B).

## Components

### 1. ChatWidget.jsx
**Main floating button component**

Features:
- ✅ Fixed position bottom-right
- ✅ Gradient background (blue to purple)
- ✅ Smooth scale animation on mount
- ✅ Pulse ring animation when closed
- ✅ Toggle between chat and close icons
- ✅ Hover effects with scale transform
- ✅ Shadow effects for depth

### 2. ChatWindow.jsx
**Chat interface component**

Features:
- ✅ Animated slide-in from bottom-right
- ✅ 600px height, 384px width (responsive)
- ✅ Gradient header with title
- ✅ Scrollable message area
- ✅ Message history stored in state
- ✅ Loading spinner with typing dots
- ✅ Input field with send button
- ✅ Auto-scroll to latest message
- ✅ API integration with error handling

### 3. MessageBubble.jsx
**Individual message component**

Features:
- ✅ Bot messages: left-aligned, gray background
- ✅ User messages: right-aligned, gradient background
- ✅ Avatar icons (Bot/User)
- ✅ Rounded corners (2xl)
- ✅ Fade-in animation
- ✅ Responsive max-width (75%)
- ✅ Whitespace preservation

## Design Features

### Colors
- **Primary Gradient:** Blue (600) to Purple (600)
- **Bot Messages:** Gray 100 background
- **User Messages:** Gradient background
- **Hover States:** Darker gradient shades

### Animations
- **Button Mount:** Spring animation with scale
- **Window Open:** Fade + slide from bottom
- **Messages:** Fade-in with slight upward motion
- **Loading:** Bouncing dots animation
- **Pulse Ring:** Continuous scale + opacity animation

### Shadows
- **Button:** shadow-2xl (large, soft shadow)
- **Window:** shadow-2xl (elevated appearance)
- **Hover:** Enhanced shadow on interaction

### Spacing
- **Messages:** 4-unit gap (1rem)
- **Padding:** Consistent 4-unit padding
- **Rounded Corners:** 2xl (1rem) for messages, full for button

## Usage

### Installation
Already integrated in `App.jsx`:

```jsx
import ChatWidget from '@/components/chat/ChatWidget';

function App() {
  return (
    <>
      <ChatWidget />
      {/* Rest of your app */}
    </>
  );
}
```

### API Configuration
The widget calls:
```
POST http://localhost:5000/api/chat
Body: { message: "user message" }
Response: { reply: "bot response" }
```

To change API endpoint, update in `ChatWindow.jsx`:
```javascript
const response = await axios.post('YOUR_API_URL/api/chat', {
  message: userMessage
});
```

## Features

### Chat History
- ✅ Stored in component state
- ✅ Persists during session
- ✅ Resets on page reload
- ✅ Auto-scrolls to latest message

### Loading States
- ✅ Typing indicator with animated dots
- ✅ Input disabled while loading
- ✅ Send button disabled while loading
- ✅ Smooth transitions

### Error Handling
- ✅ Try-catch for API calls
- ✅ Fallback error message
- ✅ User-friendly error display
- ✅ Continues working after errors

### Responsive Design
- ✅ Fixed width on desktop (384px)
- ✅ Adapts to mobile screens
- ✅ Scrollable message area
- ✅ Touch-friendly buttons

## Customization

### Change Colors
In `ChatWidget.jsx` and `ChatWindow.jsx`:
```jsx
// Change gradient
className="bg-gradient-to-r from-blue-600 to-purple-600"
// To your colors:
className="bg-gradient-to-r from-green-600 to-teal-600"
```

### Change Position
In `ChatWidget.jsx`:
```jsx
// Current: bottom-6 right-6
className="fixed bottom-6 right-6"
// Change to left:
className="fixed bottom-6 left-6"
```

### Change Size
In `ChatWindow.jsx`:
```jsx
// Current: w-96 h-[600px]
className="w-96 h-[600px]"
// Make larger:
className="w-[500px] h-[700px]"
```

### Change Initial Message
In `ChatWindow.jsx`:
```javascript
const [messages, setMessages] = useState([
  { text: 'Your custom welcome message!', isBot: true }
]);
```

### Add Conversation Context
To maintain context across messages:

```javascript
const [conversationHistory, setConversationHistory] = useState([]);

const handleSendMessage = async (e) => {
  // ... existing code ...
  
  const response = await axios.post('http://localhost:5000/api/chat', {
    message: userMessage,
    history: conversationHistory // Send history
  });
  
  setConversationHistory(prev => [
    ...prev,
    { role: 'user', content: userMessage },
    { role: 'assistant', content: response.data.reply }
  ]);
};
```

## Keyboard Shortcuts

- **Enter:** Send message
- **Escape:** Close chat window (can be added)

To add Escape key:
```javascript
useEffect(() => {
  const handleEscape = (e) => {
    if (e.key === 'Escape') onClose();
  };
  
  if (isOpen) {
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }
}, [isOpen, onClose]);
```

## Accessibility

Current features:
- ✅ Semantic HTML
- ✅ Button roles
- ✅ Form submission
- ✅ Keyboard navigation

To improve:
- [ ] Add ARIA labels
- [ ] Add focus management
- [ ] Add screen reader announcements
- [ ] Add keyboard shortcuts

## Performance

Optimizations:
- ✅ Lazy rendering (only when open)
- ✅ AnimatePresence for smooth unmounting
- ✅ Ref-based scroll (no re-renders)
- ✅ Minimal re-renders on typing

## Browser Support

Tested on:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Troubleshooting

**Widget not appearing:**
- Check if ChatWidget is imported in App.jsx
- Verify z-index (should be 50)
- Check for CSS conflicts

**API not working:**
- Verify backend is running on port 5000
- Check GROQ_API_KEY is set
- Check browser console for errors
- Verify CORS settings

**Animations not smooth:**
- Check if framer-motion is installed
- Verify no CSS transitions conflicting
- Check browser performance

**Messages not scrolling:**
- Verify messagesEndRef is attached
- Check overflow-y-auto class
- Verify scrollToBottom is called

## Future Enhancements

Possible additions:
- [ ] Persistent chat history (localStorage)
- [ ] Typing indicators
- [ ] Message timestamps
- [ ] File upload support
- [ ] Voice input
- [ ] Multi-language support
- [ ] Emoji picker
- [ ] Quick reply buttons
- [ ] Minimize to notification badge
- [ ] Sound notifications

## Example Interactions

**User:** "What services do you offer?"
**Bot:** "We offer comprehensive dental services including general dentistry, cosmetic procedures, orthodontics, root canals, teeth cleaning, and emergency care. How can I help you today?"

**User:** "How do I book an appointment?"
**Bot:** "Booking an appointment is easy! You can click the 'Book Appointment' button on our website, call us at (555) 123-4567, or I can help guide you through the process. What type of service are you interested in?"

**User:** "What are your office hours?"
**Bot:** "Our office is open Monday through Friday from 8:00 AM to 6:00 PM, and Saturdays from 9:00 AM to 2:00 PM. We're closed on Sundays. Would you like to schedule an appointment?"

## Code Structure

```
src/components/chat/
├── ChatWidget.jsx       # Main floating button
├── ChatWindow.jsx       # Chat interface
└── MessageBubble.jsx    # Message component
```

## Dependencies

Required packages:
- ✅ react
- ✅ framer-motion
- ✅ axios
- ✅ lucide-react
- ✅ @radix-ui components (via ShadCN)
- ✅ tailwindcss

All already installed in your project!

## Testing

Test the widget:
1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Click chat button (bottom-right)
4. Type a message and press Enter
5. Verify bot responds
6. Test multiple messages
7. Close and reopen widget

## Production Checklist

Before deploying:
- [ ] Update API URL to production endpoint
- [ ] Add rate limiting on frontend
- [ ] Add analytics tracking
- [ ] Test on all devices
- [ ] Optimize bundle size
- [ ] Add error boundaries
- [ ] Test accessibility
- [ ] Add loading states
- [ ] Test error scenarios
- [ ] Add user feedback mechanism

## Support

For issues or questions:
1. Check browser console for errors
2. Verify API is responding
3. Check network tab for failed requests
4. Review component props
5. Check for CSS conflicts

Your premium chatbot widget is ready to use! 🎉