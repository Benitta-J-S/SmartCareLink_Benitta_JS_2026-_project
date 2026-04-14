const express = require('express');
const Alert = require('../models/Alert');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Create alert
router.post('/create', auth, async (req, res) => {
    try {
        const { type, location, notes } = req.body;
        
        const alert = new Alert({
            patientId: req.userId,
            type: type || 'panic',
            location,
            notes,
            status: 'active'
        });
        
        await alert.save();
        
        const patient = await User.findById(req.userId);
        
        // Emit socket event if available
        const io = req.app.get('io');
        if (io) {
            io.emit('new_alert', {
                alert,
                patient: {
                    id: patient._id,
                    name: patient.name,
                    phone: patient.phone
                }
            });
        }
        
        res.status(201).json({
            message: 'Alert created successfully',
            alert
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get active alerts
router.get('/active', auth, async (req, res) => {
    try {
        let query = {};
        
        if (req.userRole === 'patient') {
            query.patientId = req.userId;
        }
        query.status = 'active';
        
        const alerts = await Alert.find(query)
            .populate('patientId', 'name phone')
            .sort('-createdAt');
        
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Acknowledge alert
router.put('/:alertId/acknowledge', auth, async (req, res) => {
    try {
        const alert = await Alert.findById(req.params.alertId);
        
        if (!alert) {
            return res.status(404).json({ error: 'Alert not found' });
        }
        
        alert.status = 'acknowledged';
        alert.acknowledgedBy = req.userId;
        alert.acknowledgedAt = new Date();
        
        await alert.save();
        
        res.json({ message: 'Alert acknowledged', alert });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Resolve alert
router.put('/:alertId/resolve', auth, async (req, res) => {
    try {
        const alert = await Alert.findById(req.params.alertId);
        
        if (!alert) {
            return res.status(404).json({ error: 'Alert not found' });
        }
        
        alert.status = 'resolved';
        alert.resolvedAt = new Date();
        
        await alert.save();
        
        res.json({ message: 'Alert resolved', alert });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;