import { db } from '../utils/db.js';
import { generateChatResponse } from '../services/geminiService.js';

export async function askChatbot(req, res) {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Question or message cannot be empty.' });
    }

    let farmerProfile = await db.farmerProfile.findUnique({
      where: { userId: req.user.id }
    });

    if (!farmerProfile) {
      farmerProfile = await db.farmerProfile.create({
        data: {
          userId: req.user.id,
          profileCompleted: false
        }
      });
    }

    // Get recent chat history for context (last 6 turns)
    const recentHistory = await db.chatHistory.findMany({
      where: { farmerId: farmerProfile.id },
      orderBy: { createdAt: 'asc' }
    });

    const aiReply = await generateChatResponse(message.trim(), recentHistory.slice(-6));

    // Save to Database
    const chatRecord = await db.chatHistory.create({
      data: {
        farmerId: farmerProfile.id,
        userMessage: message.trim(),
        aiResponse: aiReply
      }
    });

    res.json({
      success: true,
      chat: chatRecord
    });
  } catch (err) {
    console.error('Chatbot error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to process chat response. Please try again.'
    });
  }
}

export async function getChatHistory(req, res) {
  try {
    const farmerProfile = await db.farmerProfile.findUnique({
      where: { userId: req.user.id }
    });

    if (!farmerProfile) {
      return res.json({ success: true, history: [] });
    }

    const history = await db.chatHistory.findMany({
      where: { farmerId: farmerProfile.id },
      orderBy: { createdAt: 'asc' }
    });

    res.json({
      success: true,
      history
    });
  } catch (err) {
    console.error('Get chat history error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve conversation history.' });
  }
}

export async function clearChatHistory(req, res) {
  try {
    const farmerProfile = await db.farmerProfile.findUnique({
      where: { userId: req.user.id }
    });

    if (farmerProfile) {
      await db.chatHistory.deleteMany({
        where: { farmerId: farmerProfile.id }
      });
    }

    res.json({
      success: true,
      message: 'Conversation history cleared successfully.'
    });
  } catch (err) {
    console.error('Clear chat history error:', err);
    res.status(500).json({ success: false, message: 'Failed to clear conversation history.' });
  }
}
