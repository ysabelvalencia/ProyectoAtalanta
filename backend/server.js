/**
 * server.js
 *
 * Archivo principal del servidor.
 * Inicializa la aplicación Express, configura middlewares globales
 * y registra las rutas disponibles.
 *
 * Es el punto de entrada del backend.
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware global para permitir peticiones entre dominios
app.use(cors());

// Middleware para interpretar JSON en las peticiones
app.use(express.json());

// Rutas principales de autenticación
app.use('/api/auth', authRoutes);

// Ruta de prueba para comprobar que el servidor funciona
app.get('/', (req, res) => {
  res.send('API funcionando 🚀');
});

// Puerto del servidor
const PORT = 4000;

// Arranque del servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});