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

// Middlewares
const { authMiddleware, checkRole } = require('../middleware/authMiddleware');


// =======================
// RUTAS PÚBLICAS
// =======================

// Registro de usuario
router.post('/register', authController.register);

// Login de usuario
router.post('/login', authController.login);


// =======================
// RUTA PROTEGIDA 
// =======================



router.get('/profile', authMiddleware, (req, res) => {
  res.json({
     message: 'Acceso permitido',
     user: req.user
   });
});


// =======================
// RUTAS POR ROL
// =======================

// solo cliente
router.get(
  '/cliente',
  authMiddleware,
  checkRole(['cliente']),
  (req, res) => {
    res.json({ message: 'Zona cliente' });
  }
);

// trabajador
router.get(
  '/trabajador',
  authMiddleware,
  checkRole(['trabajador']),
  (req, res) => {
    res.json({ message: 'Zona trabajador' });
  }
);

// jefe
router.get(
  '/jefe',
  authMiddleware,
  checkRole(['jefe']),
  (req, res) => {
    res.json({ message: 'Zona jefe' });
  }
);

// admin
router.get(
  '/admin',
  authMiddleware,
  checkRole(['admin']),
  (req, res) => {
    res.json({ message: 'Zona admin' });
  }
);
module.exports = router;