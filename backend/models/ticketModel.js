const db = require('../config/db');

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

module.exports = {
  createTicket,
  assignTicket
};