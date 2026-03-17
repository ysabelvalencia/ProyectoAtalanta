/**
 * authMiddleware.js
 *
 * Middleware de autenticación con JWT.
 *
 * Su función es:
 * - Proteger rutas privadas
 * - Verificar que el token sea válido
 * - Extraer la información del usuario
 * - Añadirla a req.user para usarla después
 */

// Importamos JWT para verificar el token
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {

  // Obtenemos la cabecera Authorization
  const authHeader = req.headers.authorization;

  // Validamos que exista y tenga formato correcto: "Bearer TOKEN"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  // Extraemos el token (quitamos "Bearer ")
  const token = authHeader.split(' ')[1];

  try {
    // Verificamos el token con la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Guardamos los datos del usuario en la request
    // (vienen del payload del token)
    req.user = decoded;

    // Continuamos hacia la siguiente función (controller o middleware)
    next();

  } catch (error) {
    // Token inválido o expirado
    return res.status(403).json({ message: 'Token inválido' });
  }
};

// Exportamos el middleware
module.exports = authMiddleware;