/**
 * server.js
 *
 * Punto de entrada del backend.
 * Configura Express, middlewares globales y rutas.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
//npm install helmet

require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();


// =======================
//  SEGURIDAD
// =======================

// Headers de seguridad
app.use(helmet());

// Control de CORS (solo permitir tu frontend)
app.use(cors({
  origin: 'http://localhost:5500'
}));


// =======================
//  MIDDLEWARES
// =======================

// Permite recibir JSON en peticiones
app.use(express.json());


// =======================
//  RUTAS
// =======================

app.use('/api/auth', authRoutes);


// =======================
//  RUTA TEST
// =======================

app.get('/', (req, res) => {
  res.send('API funcionando 🚀');
});


// =======================
// SERVIDOR
// =======================

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});