// =================================
// ticketController.js
// =================================

const ticketModel = require('../models/ticketModel');

const createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;
    const id_cliente = req.user.idUser;

    if (!title || !description) {
      return res.status(400).json({ message: 'Faltan datos' });
    }

    const ticketId = await ticketModel.createTicket(
      title,
      description,
      id_cliente
    );

    res.status(201).json({
      message: 'Ticket creado',
      ticketId
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error servidor' });
  }
};



const assignTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_trabajador } = req.body;

    if (!id_trabajador) {
      return res.status(400).json({ message: 'Falta id_trabajador' });
    }

    const updated = await ticketModel.assignTicket(id, id_trabajador);
    if (updated === 0) {
      return res.status(404).json({ message: 'Ticket no encontrado' });
    }
    res.json({ message: 'Ticket asignado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error servidor' });
  }
};

// =======================
// CAMBIAR ESTADO
// =======================

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const id_user = req.user.idUser;

    // validar status permitido
    const allowedStatus = ['abierto', 'en_proceso', 'cerrado'];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: 'Estado no válido'
      });
    }

    // validar asignación
    const isAssigned = await ticketModel.isTicketAssignedToUser(id, id_user);

    if (!isAssigned) {
      return res.status(403).json({
        message: 'No tienes acceso a este ticket'
      });
    }

    // actualizar estado
    const updated = await ticketModel.updateTicketStatus(id, status);

    if (updated === 0) {
      return res.status(404).json({
        message: 'Ticket no encontrado'
      });
    }

    res.json({
      message: 'Estado actualizado correctamente',
      status
    });

  } catch (error) {
    console.error('Error en updateStatus:', error);
    res.status(500).json({ message: 'Error servidor' });
  }
};

// =======================
// CONSEGUIR TICKETS DEL CLIENTE
// =======================

const getMyTickets = async (req, res) => {
  try {
    const id_cliente = req.user.idUser;

    const tickets = await ticketModel.getTicketsByUser(id_cliente);

    res.json(tickets);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error servidor' });
  }
};

// =======================
// ELIMINAR TICKET
// =======================

const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const id_cliente = req.user.idUser;

    const deleted = await ticketModel.deleteTicket(id, id_cliente);

    if (deleted === 0) {
      return res.status(403).json({
        message: "No autorizado o ticket no existe"
      });
    }

    res.json({ message: "Ticket eliminado" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error servidor" });
  }
};

module.exports = {
  createTicket,
  assignTicket,
  updateStatus,
  getMyTickets,
  deleteTicket
};