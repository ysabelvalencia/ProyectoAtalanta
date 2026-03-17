/******************************************
 * db.js
 *
 * Este archivo configura y gestiona la conexión a la base de datos MySQL.
 * Utiliza un pool de conexiones para mejorar el rendimiento y evitar
 * abrir/cerrar conexiones constantemente.
 *
 * Centraliza la configuración de la base de datos usando variables de entorno,
 * lo que permite mayor seguridad y flexibilidad entre entornos.
 *************************************************/

// Importamos mysql en modo promesas
const mysql = require('mysql2/promise');

// Cargamos variables de entorno
require('dotenv').config();

// Creamos un pool de conexiones (mejor que abrir/cerrar siempre)
const pool = mysql.createPool({
  host: process.env.DB_HOST,        // dirección del servidor
  user: process.env.DB_USER,        // usuario de MySQL
  password: process.env.DB_PASSWORD,// contraseña
  database: process.env.DB_DATABASE // base de datos
});

// Exportamos el pool para usarlo en otros archivos
module.exports = pool;