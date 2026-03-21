// =================================
// commentModel.js
// =================================

const db = require('../config/db');


// ==================
// CREAR COMENTARIO
// ==================

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

// ==================
// OBTENER HISTORIAL
// ==================
const getCommentsByTicket = async (id_ticket) => {
  const [rows] = await db.query(
    `
    SELECT 
      c.id_comment,
      c.content,
      c.created_at,
      u.user_name,
      r.role_name
    FROM comments c
    JOIN users u ON c.id_user = u.id_user
    JOIN roles r ON u.id_role = r.id_role
    WHERE c.id_ticket = ?
    ORDER BY c.created_at ASC
    `,
    [id_ticket]
  );

  return rows;
};

module.exports = {
  createComment,
  getCommentsByTicket
};