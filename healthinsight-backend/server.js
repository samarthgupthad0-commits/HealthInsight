const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./database');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/consultations', require('./routes/consultationRoutes'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'HealthInsight Backend is running!',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});