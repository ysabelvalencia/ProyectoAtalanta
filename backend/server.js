/**
 * server.js
 *
 * Punto de entrada del backend.
 * Configura Express, middlewares globales y rutas.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

const app = express();


// =======================
//  SEGURIDAD
// =======================

app.use(helmet());
app.use(cors()); 


// =======================
//  MIDDLEWARES
// =======================

app.use(express.json());

// =======================
//  RUTAS
// =======================
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

// =======================
//  RUTA TEST
// =======================

app.get('/', (req, res) => {
  res.send('API funcionando');
});


// =======================
// SERVIDOR
// =======================

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});