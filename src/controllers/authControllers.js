const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const User = require('../models/userModel');

// Path to the audit logs folder
const logFolderPath = path.join(__dirname, '../audit-logs');

// Ensure the logs folder exists
if (!fs.existsSync(logFolderPath)) {
    fs.mkdirSync(logFolderPath);
}

// Function to log audit details
const logAudit = (action, username, status, message) => {
    const logFilePath = path.join(logFolderPath, `${new Date().toISOString().slice(0, 10)}.log`);
    const logEntry = `${new Date().toISOString()} - Action: ${action}, Username: ${username}, Status: ${status}, Message: ${message}\n`;

    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) {
            console.error('Failed to write to audit log:', err);
        }
    });
};

// Password policy regex: Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number, and 1 special character
const passwordPolicy = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;





// Register user
const register = async (req, res) => {
    try {
        const { username, password, email, role } = req.body;

        // Enforce password policy
        if (!passwordPolicy.test(password)) {
            logAudit('REGISTER', username, 'FAILURE', 'Password does not meet complexity requirements');
            return res.status(400).json({
                message: "Password does not meet complexity requirements. It should be at least 8 characters long, include an uppercase letter, a number, and a special character.",
            });
        }

        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            logAudit('REGISTER', username, 'FAILURE', 'Email already in use');
            return res.status(400).json({ message: "Email already in use" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role,
            verified: false,
        });

        // Save the new user to the database
        await newUser.save();

        // Generate a verification token
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

       

        logAudit('REGISTER', username, 'SUCCESS', 'User registered and verification email sent');
        res.status(201).json({ message: `User registered successfully. A verification email has been sent to ${email}.` });
    } catch (err) {
        logAudit('REGISTER', req.body.username, 'FAILURE', err.message);
        res.status(500).json({ error: err.message });
    }
};

/// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            logAudit('LOGIN', email, 'FAILURE', 'Invalid credentials');
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare the password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logAudit('LOGIN', email, 'FAILURE', 'Invalid credentials');
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id , role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        logAudit('LOGIN', email, 'SUCCESS', 'Login successful');
        res.status(200).json({ message: "Login successful", token });
    } catch (err) {
        logAudit('LOGIN', req.body.email, 'FAILURE', err.message);
        res.status(500).json({ error: err.message });
    }
};





module.exports = {
    register,
    login,
   
};
