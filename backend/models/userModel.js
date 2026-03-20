/************************************************
 * userModel.js
 ************************************************/

const db = require('../config/db');

// =======================
// BUSCAR USUARIO
// =======================

const getUserByEmail = async (email) => {
  try {
    const [rows] = await db.query(
      `
      SELECT 
        u.id_user, 
        u.user_name, 
        u.email, 
        u.password_hash, 
        u.id_role,
        r.role_name
      FROM users u
      JOIN roles r ON u.id_role = r.id_role
      WHERE u.email = ?
      `,
      [email]
    );

    return rows[0];

  } catch (error) {
    console.error('Error en getUserByEmail:', error);
    throw error;
  }
};


// =======================
// CREAR USUARIO
// =======================

// 👉 NOTA: ya NO pasamos role
// usamos DEFAULT = cliente

const createUser = async (user_name, email, passwordHash) => {
  try {
    const [result] = await db.query(
      `
      INSERT INTO users (user_name, email, password_hash)
      VALUES (?, ?, ?)
      `,
      [user_name, email, passwordHash]
    );

    return result.insertId;

  } catch (error) {
    console.error('Error en createUser:', error);
    throw error;
  }
};

const updateUserRole = async (id_user, id_role) => {
  const [result] = await db.query(
    `
    UPDATE users
    SET id_role = ?
    WHERE id_user = ?
    `,
    [id_role, id_user]
  );

  return result.affectedRows;
};


const getUserById = async (id_user) => {
  const [rows] = await db.query(
    `
    SELECT 
      u.id_user,
      u.user_name,
      r.role_name
    FROM users u
    JOIN roles r ON u.id_role = r.id_role
    WHERE u.id_user = ?
    `,
    [id_user]
  );

  return rows[0];
};


// Exportamos funciones
module.exports = {
  getUserByEmail,
  createUser,
  updateUserRole,
  getUserById
};