const express = require('express');
const Alert = require('../models/Alert');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();


// Create alert (panic button)
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
        
        // Get patient info for response
        const patient = await User.findById(req.userId);
        
        // ✅ Emit real-time alert via Socket.IO
        const io = req.app.get('io');
        if (io) {
            io.emit('new_alert', {
                alert,
                patient
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


// Get active alerts (for family members)
router.get('/active', auth, async (req, res) => {
    try {
        let query = {};
        
        if (req.userRole === 'patient') {
            query.patientId = req.userId;
        } else if (req.userRole === 'family') {
            // Family sees alerts for their linked patients
            const familyMember = await User.findById(req.userId);
            query.patientId = { $in: familyMember.linkedPatients || [] };
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