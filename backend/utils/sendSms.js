// SMS service (placeholder - integrate with Twilio later)
const sendSms = async (phoneNumber, message) => {
    try {
        console.log(`📱 SMS would be sent to ${phoneNumber}: ${message}`);
        
        // Uncomment when you have Twilio setup
        /*
        const client = require('twilio')(
            process.env.TWILIO_SID,
            process.env.TWILIO_AUTH_TOKEN
        );
        
        await client.messages.create({
            body: message,
            to: phoneNumber,
            from: process.env.TWILIO_PHONE_NUMBER
        });
        */
        
        return { success: true, message: 'SMS queued' };
    } catch (error) {
        console.error('SMS failed:', error);
        return { success: false, error: error.message };
    }
};

const sendEmergencyAlert = async (patient, alert) => {
    const message = `🚨 EMERGENCY ALERT! ${patient.name} needs help. Location: ${alert.location?.lat || 'Unknown'}, ${alert.location?.lng || 'Unknown'}. Please check the dashboard.`;
    
    // Send to all emergency contacts
    for (const contact of patient.emergencyContacts || []) {
        await sendSms(contact.phone, message);
    }
};

module.exports = { sendSms, sendEmergencyAlert };