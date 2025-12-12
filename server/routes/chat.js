import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { chatLimiter } from '../middleware/rateLimiter.js';
import Chat from '../models/Chat.js';
import { getAIResponse } from '../services/aiService.js';

const router = express.Router();

router.post('/send', authenticateToken, chatLimiter, async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.userId;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    let chat = await Chat.findOne({ user: userId });

    if (!chat) {
      chat = new Chat({
        user: userId,
        messages: []
      });
    }

    chat.messages.push({
      role: 'user',
      content: message.trim()
    });

    const recentMessages = chat.messages.slice(-10);

    const aiResponse = await getAIResponse(message.trim(), recentMessages);

    chat.messages.push({
      role: 'assistant',
      content: aiResponse
    });

    await chat.save();

    res.json({
      response: aiResponse,
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('Chat send error:', error);
    res.status(500).json({
      error: error.message || 'Failed to send message. Please try again.'
    });
  }
});

router.get('/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const chat = await Chat.findOne({ user: userId });

    if (!chat) {
      return res.json({ messages: [] });
    }

    res.json({
      messages: chat.messages,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt
    });
  } catch (error) {
    console.error('Chat history error:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

export default router;

