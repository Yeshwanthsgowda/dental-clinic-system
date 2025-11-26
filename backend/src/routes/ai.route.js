import express from 'express';
import { agentChat } from '../controllers/ai.controller.js';

const router = express.Router();

router.post('/agent', agentChat);

export default router;
