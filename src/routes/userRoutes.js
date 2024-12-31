const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const router = express.Router();

// admin access

router.get('/admin', verifyToken, authorizeRoles("admin"), (req, res) => {
    
     res.json({ message: "welcome to Admin access page" });
 
});
router.get('/manager', verifyToken,authorizeRoles("admin","manager"), (req, res) => {
    
     res.json({ message: "welcome to manager access page" });
 
});
router.get('/user',  verifyToken,authorizeRoles("admin","manager","user"), (req, res) => {
    
     res.json({ message: "welcome to user access page" });
 
});

module.exports = router;