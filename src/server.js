import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import volunteerRoutes from './routes/volunteers.js';
import { generalRateLimit, volunteerRateLimit } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:8080',
    'https://hope-united-repo.vercel.app',
    'http://localhost:5173',
    'http://localhost:8080',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors({
  origin: ['https://hope-united-repo.vercel.app'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use(express.static('src/public'));

// Rate limiting (only in production)
if (process.env.NODE_ENV === 'production') {
  app.use('/api', generalRateLimit);
  app.use('/api/volunteers', volunteerRateLimit);
} else {
  console.log('⚠️  Rate limiting disabled in development mode');
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'NGO Connect Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Admin dashboard route
app.get('/admin', (req, res) => {
  res.sendFile('admin.html', { root: 'src/public' });
});

// API routes
app.use('/api/volunteers', volunteerRoutes);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API base URL: http://localhost:${PORT}/api`);
});

export default app;