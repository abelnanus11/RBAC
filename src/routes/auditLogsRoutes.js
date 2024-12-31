// src/routes/auditLogsRoutes.js
const express = require('express');
const AuditLog = require('../models/auditLogModel');

const router = express.Router();

// Get all audit logs (can be filtered as needed)
router.get('/audit-logs', async (req, res) => {
    try {
        const logs = await AuditLog.find().populate('userId', 'username');  // Populate user details if needed
        res.status(200).json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
