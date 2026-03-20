const db = require('../config/db');


// =======================
// CREAR TICKET
// =======================

const createTicket = async (title, description, id_cliente) => {
  const [result] = await db.query(
    `
    INSERT INTO tickets (title, description, id_cliente)
    VALUES (?, ?, ?)
    `,
    [title, description, id_cliente]
  );

  return result.insertId;
};


// =======================
// ASIGNAR TICKET
// =======================

const assignTicket = async (id_ticket, id_trabajador) => {
  const [result] = await db.query(
    `
    UPDATE tickets
    SET id_trabajador = ?
    WHERE id_ticket = ?
    `,
    [id_trabajador, id_ticket]
  );

  return result.affectedRows;
};


// =======================
// VALIDAR ASIGNACIÓN
// =======================

const isTicketAssignedToUser = async (id_ticket, id_user) => {
  const [rows] = await db.query(
    `
    SELECT id_ticket
    FROM tickets
    WHERE id_ticket = ? AND id_trabajador = ?
    `,
    [id_ticket, id_user]
  );

  return rows.length > 0;
};

// =======================
// CAMBIAR ESTADO
// =======================

const updateTicketStatus = async (id_ticket, status) => {
  const [result] = await db.query(
    `
    UPDATE tickets
    SET status = ?
    WHERE id_ticket = ?
    `,
    [status, id_ticket]
  );

  return result.affectedRows;
};

// =======================
// EXPORT
// =======================

module.exports = {
  createTicket,
  assignTicket,
  isTicketAssignedToUser,
  updateTicketStatus
};