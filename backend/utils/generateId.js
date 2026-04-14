const generateDigitalID = (user) => {
    const prefix = 'CL';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}${timestamp}${random}`;
};

const generateAlertId = () => {
    return `ALT_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
};

module.exports = { generateDigitalID, generateAlertId };