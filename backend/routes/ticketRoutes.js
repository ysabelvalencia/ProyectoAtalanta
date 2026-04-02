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

// =======================
// TICKETS - STAFF
// =======================

// JEFE - VER TRABAJADORES
router.get(
  '/workers',
  authMiddleware,
  checkRole(['jefe']),
  async (req, res) => {
    try {
      const workers = await require('../models/userModel').getWorkers();
      res.json(workers);
    } catch (error) {
      res.status(500).json({ message: 'Error servidor' });
    }
  }
);

// JEFE - VER TODOS LOS TICKETS
router.get(
  '/all',
  authMiddleware,
  checkRole(['jefe']),
  ticketController.getAllTickets
);

// TRABAJADOR - VER TICKETS ASIGNADOS
router.get(
  '/assigned',
  authMiddleware,
  checkRole(['trabajador']),
  ticketController.getAssignedTickets
);

// =======================
// COMMENTS
// =======================

// TRABAJADOR - AÑADIR COMENTARIOS
router.post(
  '/:id/comments',
  authMiddleware,
  checkRole(['trabajador']),
  commentController.createComment
);

// HISTORIAL (staff)
router.get(
  '/:id/comments',
  authMiddleware,
  checkRole(['trabajador', 'jefe', 'admin']),
  commentController.getComments
);

//  BORRAR COMENTARIO
router.delete(
  '/comments/:id',
  authMiddleware,
  checkRole(['trabajador']),
  commentController.deleteComment
);

// =======================
// ACCIONES SOBRE TICKET
// =======================

// JEFE - ASIGNAR
router.put(
  '/:id/asignar',
  authMiddleware,
  checkRole(['jefe']),
  ticketController.assignTicket
);

// TRABAJADOR - CAMBIAR ESTADO
router.put(
  '/:id/status',
  authMiddleware,
  checkRole(['trabajador']),
  ticketController.updateStatus
);

// CLIENTE - ELIMINAR
router.delete(
  '/:id',
  authMiddleware,
  checkRole(['cliente']),
  ticketController.deleteTicket
);


router.get(
  '/:id',
  authMiddleware,
  ticketController.getTicketById
);


module.exports = router;