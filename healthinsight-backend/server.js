// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = 'mongodb://localhost:27017/healthinsight';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.log('❌ MongoDB Error:', err.message));

// Routes
app.get('/', (req, res) => {
    res.json({ 
        message: 'HealthInsight API is running!',
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        server: 'Running',
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        timestamp: new Date().toISOString()
    });
});

// Debug route to see all users
app.get('/api/debug/users', async (req, res) => {
    try {
        const User = require('./models/User');
        const users = await User.find().sort({ createdAt: -1 });
        
        console.log('📊 Total users in database:', users.length);
        
        res.json({
            success: true,
            message: `Found ${users.length} users`,
            users: users.map(user => ({
                id: user._id,
                name: user.fullName,
                email: user.email,
                created: user.createdAt,
                lastLogin: user.lastLogin
            }))
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Auth routes
app.use('/api/auth', require('./routes/auth'));

app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
    console.log(' Health check: http://localhost:5000/api/health');
    console.log('Debug users: http://localhost:5000/api/debug/users');
});