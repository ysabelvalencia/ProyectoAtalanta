/**
 * authRoutes.js
 *
 * Define las rutas de autenticación.
 * Conecta las peticiones HTTP con los controllers.
 */

const express = require('express');
const router = express.Router();

// Importamos controller de autenticación
const authController = require('../controllers/authController');

// =======================
// RUTAS PÚBLICAS
// =======================

// Registro de usuario
router.post('/register', authController.register);

// Login de usuario
router.post('/login', authController.login);


// =======================
// RUTA PROTEGIDA (opcional)
// =======================

const authMiddleware = require('../middleware/authMiddleware');

router.get('/profile', authMiddleware, (req, res) => {
  res.json({
     message: 'Acceso permitido',
     user: req.user
   });
});

module.exports = router;