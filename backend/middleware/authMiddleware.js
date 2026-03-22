/**
 * authMiddleware.js
 *
 * Middleware de autenticación y autorización con JWT.
 *
 * Funciones:
 * - Verificar token (authMiddleware)
 * - Controlar acceso por roles (checkRole)
 */

const jwt = require("jsonwebtoken");

// =======================
// AUTENTICACIÓN
// =======================

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No autorizado" });
  }

  const token = authHeader.split(" ")[1];

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED TOKEN:", decoded);

    req.user = {
      idUser: decoded.idUser,
      role: decoded.role,
    };

    console.log("REQ.USER:", req.user);

    next();

  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

// =======================
// AUTORIZACIÓN POR ROL
// =======================

const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    // Aseguramos que el usuario esté autenticado
    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" });
    }

    // Verificamos si el rol está permitido
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Acceso prohibido" });
    }

    next();
  };
};

// =======================
// EXPORT
// =======================

module.exports = {
  authMiddleware,
  checkRole,
};
