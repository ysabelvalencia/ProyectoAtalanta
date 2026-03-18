/************************************************
 * userModel.js
 *
 * Modelo de usuario.
 * Se encarga de interactuar directamente con la base de datos.
 * Aquí SOLO se hacen consultas SQL.
 ************************************************/

const db = require('../config/db');

// =======================
// BUSCAR USUARIO
// =======================

const getUserByEmail = async (email) => {
  try {
    // Query segura con parámetros (evita SQL Injection)
    const [rows] = await db.query(
      'SELECT id_user, nombre, email, password_hash, rol FROM users WHERE email = ?', // 👈 AÑADIDO nombre
      [email]
    );

    // Devolvemos el primer usuario encontrado
    return rows[0];

  } catch (error) {
    console.error('Error en getUserByEmail:', error);
    throw error;
  }
};


// =======================
// CREAR USUARIO
// =======================

const createUser = async (nombre, email, passwordHash, role) => {
  try {
    const [result] = await db.query(
      'INSERT INTO users (nombre, email, password_hash, rol) VALUES (?, ?, ?, ?)',
      [nombre, email, passwordHash, role]
    );

    return result;

  } catch (error) {
    console.error('Error en createUser:', error);
    throw error;
  }
};


// Exportamos funciones
module.exports = {
  getUserByEmail,
  createUser,
};