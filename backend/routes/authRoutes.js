//backend/routes/authRoutes.js
const express = require('express');
const { login, register } = require('../controllers/authController'); // Ensure correct imports

const router = express.Router();

// Define routes correctly
router.post('/register', register);
router.post('/login', login);

module.exports = router;
