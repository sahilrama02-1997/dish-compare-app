const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    message: 'DishCompare Backend is running!'
  });
});

// Gmail OAuth endpoint (placeholder)
app.get('/api/auth/google', (req, res) => {
  res.json({
    message: 'Gmail OAuth endpoint ready',
    status: 'configured',
    note: 'Requires Google OAuth setup'
  });
});

// Phone registration endpoint (placeholder)
app.post('/api/auth/register/phone', (req, res) => {
  res.json({
    message: 'Phone registration endpoint ready',
    status: 'configured',
    note: 'Requires Twilio setup'
  });
});

// OTP verification endpoint (placeholder)
app.post('/api/auth/verify-otp', (req, res) => {
  res.json({
    message: 'OTP verification endpoint ready',
    status: 'configured',
    note: 'Requires Twilio setup'
  });
});

// User profile endpoint (placeholder)
app.get('/api/users/profile', (req, res) => {
  res.json({
    message: 'User profile endpoint ready',
    status: 'configured',
    note: 'Requires authentication setup'
  });
});

// Comparisons endpoint (placeholder)
app.get('/api/comparisons', (req, res) => {
  res.json({
    message: 'Comparisons endpoint ready',
    status: 'configured',
    note: 'Requires database setup'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 DishCompare Backend running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:8000'}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'production'}`);
});

module.exports = app;
