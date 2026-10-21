import './utils/env.js';
import { logSmtpDiagnostics } from './utils/env.js';
import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './utils/db.js';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import farmerRoutes from './routes/farmerRoutes.js';
import workProfileRoutes from './routes/workProfileRoutes.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import ppeRoutes from './routes/ppeRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import chemicalRoutes from './routes/chemicalRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Global Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'AgroMed AI Backend API',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/farmer', farmerRoutes);
app.use('/api/work-profile', workProfileRoutes);
app.use('/api/health-assessment', assessmentRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/ppe-recommendations', ppeRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/chemicals', chemicalRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize DB and launch server
async function startServer() {
  await initializeDatabase();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌾 AgroMed AI Server running on http://0.0.0.0:${PORT}`);
    console.log(`📋 API Health: http://localhost:${PORT}/api/health`);
    logSmtpDiagnostics();
  });
}

startServer();
