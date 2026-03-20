const express = require('express');
const router = express.Router();

const { authMiddleware, checkRole } = require('../middleware/authMiddleware');
const ticketController = require('../controllers/ticketController');
const commentController = require('../controllers/commentController');


// =======================
// 🎫 TICKETS
// =======================

// cliente crea ticket
router.post(
  '/',
  authMiddleware,
  checkRole(['cliente']),
  ticketController.createTicket
);

// jefe asigna ticket
router.put(
  '/:id/asignar',
  authMiddleware,
  checkRole(['jefe']),
  ticketController.assignTicket
);

// trabajador cambia estado
router.put(
  '/:id/status',
  authMiddleware,
  checkRole(['trabajador']),
  ticketController.updateStatus
);


// =======================
// 💬 COMMENTS
// =======================

// SOLO trabajador comenta
router.post(
  '/:id/comments',
  authMiddleware,
  checkRole(['trabajador']),
  commentController.createComment
);

// historial (todos pueden verlo)
router.get(
  '/:id/comments',
  authMiddleware,
  checkRole(['trabajador', 'jefe', 'admin']),
  commentController.getComments
);


module.exports = router;