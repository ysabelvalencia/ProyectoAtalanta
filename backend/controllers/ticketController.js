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

module.exports = {
  createTicket,
  assignTicket
};