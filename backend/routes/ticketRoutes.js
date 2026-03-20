const express = require('express');
const router = express.Router();

const { authMiddleware, checkRole } = require('../middleware/authMiddleware');
const ticketController = require('../controllers/ticketController');

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

module.exports = router;