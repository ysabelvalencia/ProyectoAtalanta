/************************************************
 * userModel.js
 *
 * Este archivo representa la capa de acceso a datos (Model).
 * Se encarga de interactuar directamente con la base de datos MySQL,
 * ejecutando consultas relacionadas con los usuarios.
 *
 * Aquí se definen funciones que permiten:
 * - Buscar usuarios (por ejemplo, por email)
 * - Crear nuevos usuarios en la base de datos
 *
 * No contiene lógica de negocio ni validaciones complejas,
 * ya que esa responsabilidad pertenece a los controllers.
 *
 * Su objetivo es separar la lógica de base de datos del resto de la aplicación,
 * facilitando el mantenimiento, la escalabilidad y la reutilización del código.
 **********************************************************************************/


// Importamos la conexión a la base de datos
const db = require('../config/db');

// Función para buscar usuario por email
const getUserByEmail = async (email) => {
  // Ejecuta query segura (evita SQL Injection)
  const [rows] = await db.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );

  // Devuelve el primer resultado
  return rows[0];
};

// Función para crear un usuario nuevo
const createUser = async (email, password, role) => {
  const [result] = await db.query(
    'INSERT INTO users (email, password, role) VALUES (?, ?)',
    [email, password, role]
  );

  return result;
};

// Exportamos funciones
module.exports = {
  getUserByEmail,
  createUser,
};