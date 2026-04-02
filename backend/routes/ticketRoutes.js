// =======================
// ticketRoutes.js
// =======================

const express = require('express');
const router = express.Router();

const { authMiddleware, checkRole } = require('../middleware/authMiddleware');
const ticketController = require('../controllers/ticketController');
const commentController = require('../controllers/commentController');


// =======================
// TICKETS - CLIENTE
// =======================

// Cliente crea ticket
router.post(
  '/',
  authMiddleware,
  checkRole(['cliente']),
  ticketController.createTicket
);

// Cliente ve sus tickets
router.get(
  '/',
  authMiddleware,
  checkRole(['cliente']),
  ticketController.getMyTickets
);

// Cliente borra ticket
router.delete(
  '/:id',
  authMiddleware,
  checkRole(['cliente']),
  ticketController.deleteTicket
);



// =======================
// TICKETS - STAFF
// =======================

// Jefe asigna ticket
router.put(
  '/:id/asignar',
  authMiddleware,
  checkRole(['jefe']),
  ticketController.assignTicket
);

// Trabajador ve sus tickets asignados
router.get(
  '/assigned',
  authMiddleware,
  checkRole(['trabajador']),
  ticketController.getAssignedTickets
);

// Trabajador cambia estado
router.put(
  '/:id/status',
  authMiddleware,
  checkRole(['trabajador']),
  ticketController.updateStatus
);



// =======================
// COMMENTS
// =======================

// Trabajador añade comentario
router.post(
  '/:id/comments',
  authMiddleware,
  checkRole(['trabajador']),
  commentController.createComment
);

// Trabajador borra comentario

router.delete(
  '/comments/:id',
  authMiddleware,
  checkRole(['trabajador']),
  commentController.deleteComment
);

// Historial (staff)
router.get(
  '/:id/comments',
  authMiddleware,
  checkRole(['trabajador', 'jefe', 'admin']),
  commentController.getComments
);


router.get(
  '/:id',
  authMiddleware,
  ticketController.getTicketById
);

module.exports = router;