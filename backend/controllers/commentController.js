// =======================
// commentController.js
// =======================


const commentModel = require('../models/commentModel');
const ticketModel = require('../models/ticketModel');


// =======================
// CREAR COMENTARIO
// =======================

const createComment = async (req, res) => {
  try {
    const { id } = req.params; // id_ticket
    const { content } = req.body;
    const id_user = req.user.idUser;

    // Validación básica
    if (!content) {
      return res.status(400).json({ message: 'Contenido vacío' });
    }

    // VALIDACIÓN CLAVE (solo tickets asignados)
    const isAssigned = await ticketModel.isTicketAssignedToUser(id, id_user);

    if (!isAssigned) {
      return res.status(403).json({
        message: 'No tienes acceso a este ticket'
      });
    }

    // Crear comentario
    const commentId = await commentModel.createComment(
      content,
      id,
      id_user
    );

    res.status(201).json({
      message: 'Comentario añadido',
      commentId
    });

  } catch (error) {
    console.error('Error en createComment:', error);
    res.status(500).json({ message: 'Error servidor' });
  }
};


// =======================
// OBTENER HISTORIAL
// =======================

const getComments = async (req, res) => {
  try {
    const { id } = req.params;

    const comments = await commentModel.getCommentsByTicket(id);

    res.json({
      message: 'Historial de comentarios',
      comments
    });

  } catch (error) {
    console.error('Error en getComments:', error);
    res.status(500).json({ message: 'Error servidor' });
  }
};

// =======================
// BORRAR COMENTARIO
// =======================

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params; 
    const id_user = req.user.idUser;

    const isOwner = await commentModel.isCommentOwner(id, id_user);

    if (!isOwner) {
      return res.status(403).json({
        message: 'No puedes borrar este comentario'
      });
    }

    await commentModel.deleteComment(id);

    res.json({
      message: 'Comentario eliminado'
    });

  } catch (error) {
    console.error('Error en deleteComment:', error);
    res.status(500).json({ message: 'Error servidor' });
  }
};


module.exports = {
  createComment,
  getComments,
  deleteComment
}