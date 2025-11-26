import express from 'express';
import { aiChat, clearConversation } from '../controllers/aiChatController.js';

const router = express.Router();

router.post('/', aiChat);
router.delete('/:conversationId', clearConversation);

export default router;
