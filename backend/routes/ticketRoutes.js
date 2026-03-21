// =======================
// ticketRoutes.js
// =======================

const express = require('express');
const router = express.Router();

const { authMiddleware, checkRole } = require('../middleware/authMiddleware');
const ticketController = require('../controllers/ticketController');
const commentController = require('../controllers/commentController');


// =======================
// TICKETS
// =======================

// Cliente crea ticket
router.post(
  '/',
  authMiddleware,
  checkRole(['cliente']),
  ticketController.createTicket
);

// Jefe asigna ticket
router.put(
  '/:id/asignar',
  authMiddleware,
  checkRole(['jefe']),
  ticketController.assignTicket
);

// Trabajador cambia estado
router.put(
  '/:id/status',
  authMiddleware,
  checkRole(['trabajador']),
  ticketController.updateStatus
);

// Cliente ve sus tickets
router.get(
  '/',
  authMiddleware,
  checkRole(['cliente']),
  ticketController.getMyTickets
);


// =======================
// COMMENTS
// =======================

// SOLO trabajador comenta
router.post(
  '/:id/comments',
  authMiddleware,
  checkRole(['trabajador']),
  commentController.createComment
);

// Historial (todos pueden verlo)
router.get(
  '/:id/comments',
  authMiddleware,
  checkRole(['trabajador', 'jefe', 'admin']),
  commentController.getComments
);


module.exports = router;