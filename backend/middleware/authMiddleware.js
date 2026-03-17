/**
 * authMiddleware.js
 *
 * Este middleware se encarga de proteger rutas privadas mediante JWT.
 * Verifica que el token enviado en la cabecera sea válido y, en caso correcto,
 * añade la información del usuario a la request.
 *
 * Se utiliza en endpoints que requieren autenticación.
 */

const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  // Obtenemos el token del header Authorization
  const token = req.headers.authorization;

  // Si no hay token, acceso denegado
  if (!token) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  try {
    // Verificamos el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Guardamos datos del usuario en la request
    req.user = decoded;

    next(); // continúa hacia el controller
  } catch (error) {
    res.status(403).json({ message: 'Token inválido' });
  }
};

module.exports = authMiddleware;