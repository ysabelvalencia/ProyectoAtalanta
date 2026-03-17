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
  host: process.env.DB_HOST,        // Dirección del servidor (localhost normalmente)
  user: process.env.DB_USER,        // Usuario de la base de datos
  password: process.env.DB_PASSWORD,// Contraseña
  database: process.env.DB_DATABASE,// Nombre de la base de datos

  waitForConnections: true, // Si todas las conexiones están ocupadas, espera en cola
  connectionLimit: 10,      // Máximo 10 conexiones simultáneas
  queueLimit: 0             // Cola infinita (no rechaza peticiones)
});


// Test de conexión (se ejecuta automáticamente al iniciar el servidor)
// Sirve para comprobar que la base de datos está funcionando
(async () => {
  try {
    // Pedimos una conexión del pool
    const connection = await pool.getConnection();

    // Si llega aquí, conexión OK
    console.log('Conectado a MySQL');

    // MUY IMPORTANTE: devolvemos la conexión al pool
    connection.release();

  } catch (error) {
    // Si falla, mostramos el error
    console.error('Error conectando a MySQL:', error.message);
  }
})();


// Exportamos el pool para poder usarlo en otros archivos (models)
module.exports = pool;