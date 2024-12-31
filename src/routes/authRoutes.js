const express = require("express");
const {register, login, verifyEmail} = require("../controllers/authControllers");
const router = express.Router();
const logAction = require("../middleware/auditLogMiddleware");

router.post("/register",logAction,register);
router.post("/login",logAction, login);



module.exports = router;