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

// Importamos la librería mysql2 en modo promesas
// Nos permite usar async/await en vez de callbacks
const mysql = require('mysql2/promise');


// Creamos un pool de conexiones a la base de datos
// Este pool gestiona varias conexiones reutilizables

const pool = mysql.createPool({
  host: process.env.DB_HOST,     
  user: process.env.DB_USER,      
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,

  waitForConnections: true, 
  connectionLimit: 10,   
  queueLimit: 0  
});


// Test de conexión (se ejecuta automáticamente al iniciar el servidor)
// Sirve para comprobar que la base de datos está funcionando

(async () => {
  try {
    // Pedimos una conexión del pool
    const connection = await pool.getConnection();

    // Si llega aquí, conexión OK
    console.log('Conectado a MySQL');

    // devolvemos la conexión al pool
    connection.release();

  } catch (error) {
    console.error('Error conectando a MySQL:', error.message);
  }
})();

module.exports = pool;