// src/models/auditLogModel.js
const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assumes you have a User model
        required: true,
    },
    action: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    ipAddress: {
        type: String,
        required: true,
    },
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;
