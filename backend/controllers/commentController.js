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

    // Solo tickets asignados
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
    const user = req.user;

    if (user.role === 'trabajador') {
      const isAssigned = await ticketModel.isTicketAssignedToUser(
        id,
        user.idUser
      );

      if (!isAssigned) {
        return res.status(403).json({
          message: 'No tienes acceso a este ticket'
        });
      }
    }

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

    console.log("DELETE comment:", id, "user:", id_user);

    // Validación básica
    if (!id) {
      return res.status(400).json({ message: "ID inválido" });
    }

    // Comprobar que el comentario existe y es del usuario
    const isOwner = await commentModel.isCommentOwner(id, id_user);

    if (!isOwner) {
      return res.status(403).json({
        message: "No puedes borrar este comentario"
      });
    }

    // Borrar comentario
    const deleted = await commentModel.deleteComment(id);

    if (!deleted) {
      return res.status(404).json({
        message: "Comentario no encontrado"
      });
    }

    return res.json({
      message: "Comentario eliminado"
    });

  } catch (error) {
    console.error("Error en deleteComment:", error);
    return res.status(500).json({
      message: "Error servidor"
    });
  }
};


module.exports = {
  createComment,
  getComments,
  deleteComment
}