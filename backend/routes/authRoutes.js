// =======================
// authRoutes.js
// =======================

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
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
// ADMIN - GESTIÓN ROLES
// =======================

router.put(
  '/users/:id/role',
  authMiddleware,
  checkRole(['admin']),
  authController.updateRole
);

// ============================================
// RUTAS DE VALIDACION DE ACCESO POR ROLES (TESTING)
// ==============================================

// Cliente
router.get(
  '/cliente',
  authMiddleware,
  checkRole(['cliente']),
  (req, res) => {
    res.json({ message: 'Zona cliente' });
  }
);

// Trabajador
router.get(
  '/trabajador',
  authMiddleware,
  checkRole(['trabajador']),
  (req, res) => {
    res.json({ message: 'Zona trabajador' });
  }
);

// Jefe
router.get(
  '/jefe',
  authMiddleware,
  checkRole(['jefe']),
  (req, res) => {
    res.json({ message: 'Zona jefe' });
  }
);

// Admin
router.get(
  '/admin',
  authMiddleware,
  checkRole(['admin']),
  (req, res) => {
    res.json({ message: 'Zona admin' });
  }
);



module.exports = router;