const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Import routes
const authRoutes = require('./routes/auth'); 

// Middleware
app.use(cors());
app.use(express.json());

// Use the authentication routes
app.use('/api', authRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('HR System API Running');
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Start server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});


