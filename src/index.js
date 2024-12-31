const express = require("express");
const dotenv = require("dotenv").config();
const dbConnect = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const auditLogsRoutes = require("./routes/auditLogsRoutes");  // Import audit log routes
const logAction = require("./middleware/auditLogMiddleware");  // Import the audit log middleware

dbConnect();
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Use audit log middleware globally (optional, you can also apply it to specific routes)
app.use(logAction);  // This logs every incoming request for auditing purposes

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/audit", auditLogsRoutes);  // Add route to fetch audit logs

const PORT = process.env.PORT || 7002;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
