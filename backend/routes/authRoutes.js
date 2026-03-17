/**
 * authRoutes.js
 *
 * Este archivo define las rutas relacionadas con la autenticación.
 * Actúa como intermediario entre las peticiones HTTP y los controllers.
 *
 * Se encarga de mapear cada endpoint a su función correspondiente.
 */

const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

// Ruta para registrar usuario
router.post('/register', authController.register);

// Ruta para login
router.post('/login', authController.login);

module.exports = router;