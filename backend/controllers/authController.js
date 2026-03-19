/**
 * authController.js
 *
 * Controlador de autenticación:
 * - Registro
 * - Login
 *
 * Seguridad aplicada:
 * - Validación de datos
 * - Sanitización (XSS)
 * - Hash de contraseñas (bcrypt)
 * - JWT con expiración
 * - Mensajes de error seguros
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const xss = require('xss');
const validator = require('validator');

const userModel = require('../models/userModel');


// =======================
// 🟢 REGISTRO
// =======================

const register = async (req, res) => {
  try {
    let { nombre, email, password } = req.body;

    // Validación básica
    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Faltan datos' });
    }

    // Sanitización
    const cleanNombre = xss(nombre.trim()).slice(0, 100);
    const cleanEmail = xss(email.trim().toLowerCase());

    // Validación email
    if (!validator.isEmail(cleanEmail)) {
      return res.status(400).json({ message: 'Email inválido' });
    }

    // Validación password
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password demasiado corta' });
    }

    // Comprobar si ya existe
    const existingUser = await userModel.getUserByEmail(cleanEmail);

    if (existingUser) {
      return res.status(409).json({ message: 'Usuario ya existe' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 💾 Crear usuario → obtenemos ID
    const newUserId = await userModel.createUser(
      cleanNombre,
      cleanEmail,
      hashedPassword,
      'Cliente'
    );

    // 🔑 Generar token (AUTO LOGIN)
    const token = jwt.sign(
      {
        idUser: newUserId,
        role: 'cliente'
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    // 📦 Respuesta
    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      token,
      user: {
        id: newUserId,
        nombre: cleanNombre,
        email: cleanEmail,
        rol: 'Cliente'
      }
    });

  } catch (error) {
    console.error('Error en register:', error);
    return res.status(500).json({ message: 'Error servidor' });
  }
};

// =======================
// 🔵 LOGIN
// =======================

const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    // Validación básica
    if (!email || !password) {
      return res.status(400).json({ message: 'Faltan datos' });
    }

    // Sanitización
    const cleanEmail = xss(email.trim().toLowerCase());

    // Validación email
    if (!validator.isEmail(cleanEmail)) {
      return res.status(400).json({ message: 'Email inválido' });
    }

    // Buscar usuario
    const user = await userModel.getUserByEmail(cleanEmail);

    // Mensaje genérico (seguridad)
    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Comparar password
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Generar JWT
    const token = jwt.sign(
      {
        idUser: user.id_user,
        role: user.rol.toLowerCase()
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '2h'
      }
    );

    // Respuesta
    return res.json({
      message: 'Login correcto',
      token,
      user: {
        id: user.id_user,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ message: 'Error servidor' });
  }
};


// =======================
// 📤 EXPORT
// =======================

module.exports = {
  register,
  login
};
