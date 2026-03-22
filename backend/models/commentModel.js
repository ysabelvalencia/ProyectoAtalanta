// =================================
// commentModel.js
// =================================

const db = require('../config/db');

// =======================
// CREAR COMENTARIO
// =======================

const createComment = async (content, id_ticket, id_user) => {
  const [result] = await db.query(
    `
    INSERT INTO comments (content, id_ticket, id_user)
    VALUES (?, ?, ?)
    `,
    [content, id_ticket, id_user]
  );

  return result.insertId;
};


// =======================
// OBTENER COMENTARIOS POR TICKET
// =======================

const getCommentsByTicket = async (id_ticket) => {
  const [rows] = await db.query(
    `
    SELECT c.id_comment, c.content, c.created_at, c.id_user, u.user_name
    FROM comments c
    JOIN users u ON c.id_user = u.id_user
    WHERE c.id_ticket = ?
    ORDER BY c.created_at ASC
    `,
    [id_ticket]
  );

  return rows;
};


// =======================
// COMPROBAR SI ES OWNER
// =======================

const isCommentOwner = async (id_comment, id_user) => {
  const [rows] = await db.query(
    `
    SELECT id_user
    FROM comments
    WHERE id_comment = ?
    `,
    [id_comment]
  );

  if (rows.length === 0) return false;

  return rows[0].id_user === id_user;
};


// =======================
// BORRAR COMENTARIO
// =======================

const deleteComment = async (id_comment) => {
  const [result] = await db.query(
    `
    DELETE FROM comments
    WHERE id_comment = ?
    `,
    [id_comment]
  );

  return result.affectedRows;
};


// =======================
// EXPORT
// =======================

module.exports = {
  createComment,
  getCommentsByTicket,
  isCommentOwner,
  deleteComment
};