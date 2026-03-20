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


// =======================
// 💬 COMMENTS (anidados a ticket)
// =======================

// crear comentario (cliente o trabajador)
router.post(
  '/:id/comments',
  authMiddleware,
  checkRole(['cliente', 'trabajador']),
  commentController.createComment
);

// obtener historial de comentarios
router.get(
  '/:id/comments',
  authMiddleware,
  commentController.getComments
);


module.exports = router;