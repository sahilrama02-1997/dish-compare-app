// Simple Backend for Testing
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001; // Different port to avoid conflicts

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'DishCompare Backend is running!',
        timestamp: new Date().toISOString()
    });
});

// Gmail OAuth (Mock)
app.get('/api/auth/google', (req, res) => {
    res.json({
        message: 'Gmail OAuth endpoint - would redirect to Google',
        url: 'https://accounts.google.com/oauth/authorize'
    });
});

// Phone Registration (Mock)
app.post('/api/auth/register/phone', (req, res) => {
    const { name, phone } = req.body;
    res.json({
        message: 'OTP sent to phone number',
        phone: phone,
        otp: '123456' // Mock OTP for testing
    });
});

// Phone Verification (Mock)
app.post('/api/auth/verify/phone', (req, res) => {
    const { phone, otp } = req.body;
    if (otp === '123456') {
        res.json({
            message: 'Phone verified successfully',
            user: {
                id: Date.now(),
                name: 'Test User',
                phone: phone
            }
        });
    } else {
        res.status(400).json({
            message: 'Invalid OTP'
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Test Backend running on http://localhost:${PORT}`);
    console.log(`📱 Health Check: http://localhost:${PORT}/api/health`);
});
