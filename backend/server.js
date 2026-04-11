const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB error:', err));

// Store connected users
const connectedUsers = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('🔌 New client connected:', socket.id);
    
    socket.on('register', (userId) => {
        connectedUsers.set(userId, socket.id);
        console.log(`✅ User ${userId} registered`);
    });
    
    socket.on('emergency', (data) => {
        console.log('🚨 EMERGENCY ALERT:', data);
        socket.broadcast.emit('new_alert', {
            ...data,
            timestamp: new Date()
        });
    });
    
    socket.on('location_update', (data) => {
        socket.broadcast.emit('patient_location', data);
    });
    
    socket.on('disconnect', () => {
        for (let [userId, socketId] of connectedUsers.entries()) {
            if (socketId === socket.id) {
                connectedUsers.delete(userId);
                break;
            }
        }
    });
});

// Import routes
const authRoutes = require('./routes/auth');
const alertRoutes = require('./routes/alerts');
const locationRoutes = require('./routes/locations');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/locations', locationRoutes);

// Test route
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'CareLink API is running' });
});

// Make io accessible to routes
app.set('io', io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📡 Socket.IO server ready`);
});