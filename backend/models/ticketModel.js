// =================================
// ticketModel.js
// =================================

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
// OBTENER TICKETS DEL CLIENTE
// =======================

const getTicketsByUser = async (id_cliente) => {
  const [rows] = await db.query(
    `
    SELECT 
      t.id_ticket,
      t.title,
      t.description,
      t.status,
      t.created_at,
      u.user_name
    FROM tickets t
    JOIN users u ON t.id_cliente = u.id_user
    WHERE t.id_cliente = ?
    ORDER BY t.created_at DESC
    `,
    [id_cliente]
  );

  return rows;
};

// =======================
// OBTENER TICKETS POR ID
// =======================

const getTicketById = async (id_ticket) => {
  const [rows] = await db.query(
    `
    SELECT 
      t.id_ticket,
      t.title,
      t.description,
      t.status,
      t.created_at,
      u.user_name
    FROM tickets t
    JOIN users u ON t.id_cliente = u.id_user
    WHERE t.id_ticket = ?
    `,
    [id_ticket]
  );

  return rows[0];
};

// =======================
// OBTENER TICKETS ASIGNADOS AL TRABAJADOR
// =======================

const getTicketsByWorker = async (id_trabajador) => {

  console.log("QUERY WORKER EJECUTADA");
  const [rows] = await db.query(
    `
    SELECT 
      t.id_ticket,
      t.title,
      t.description,
      t.status,
      t.created_at,
      u.user_name
    FROM tickets t
    JOIN users u ON t.id_cliente = u.id_user
    WHERE t.id_trabajador = ?
    ORDER BY t.created_at DESC
    `,
    [id_trabajador]
  );

  console.log("RESULT QUERY:", rows);

  return rows;
};

// =======================
// BORRAR TICKET
// =======================

const deleteTicket = async (id_ticket, id_cliente) => {
  const [result] = await db.query(
    `
    DELETE FROM tickets
    WHERE id_ticket = ? AND id_cliente = ?
    `,
    [id_ticket, id_cliente]
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
  updateTicketStatus,
  getTicketsByUser,
  deleteTicket,
  getTicketsByWorker,
  getTicketById
};