const express = require('express');
const Location = require('../models/Location');
const auth = require('../middleware/auth');
const router = express.Router();

// Save location
router.post('/track', auth, async (req, res) => {
    try {
        const { lat, lng, accuracy } = req.body;
        
        const location = new Location({
            userId: req.userId,
            lat,
            lng,
            accuracy
        });
        
        await location.save();
        
        res.status(201).json({ message: 'Location saved' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get patient's recent locations (for family)
router.get('/patient/:patientId/recent', auth, async (req, res) => {
    try {
        const locations = await Location.find({
            userId: req.params.patientId
        }).sort('-timestamp').limit(50);
        
        res.json(locations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;