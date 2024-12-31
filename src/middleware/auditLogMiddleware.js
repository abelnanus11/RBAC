// src/middleware/auditLogMiddleware.js
const AuditLog = require('../models/auditLogModel');

// Audit log middleware to record actions
const logAction = async (req, res, next) => {
    const userId = req.user ? req.user.id : null;  // You may need to extract the user ID from the token if authenticated
    const action = req.method;  // GET, POST, PUT, DELETE (for example)
    const description = req.originalUrl;  // Description of the endpoint being accessed
    const ipAddress = req.ip;  // Capture IP address

    if (userId) {
        try {
            const newLog = new AuditLog({
                userId,
                action,
                description,
                ipAddress,
            });

            await newLog.save();  // Save the log entry in the database
            console.log(`Audit Log Created: ${action} - ${description}`);
        } catch (err) {
            console.error('Error saving audit log:', err);
        }
    }

    next();  // Proceed to the next middleware or route handler
};

module.exports = logAction;
