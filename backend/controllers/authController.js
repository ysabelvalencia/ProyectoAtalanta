/**
 * authController.js
 *
 * Controlador de autenticación.
 * Aquí se gestiona la lógica de:
 * - Registro de usuario
 * - Login de usuario
 *
 * Se encarga de:
 * - Validar datos
 * - Hashear contraseñas
 * - Generar tokens JWT
 */

// Importamos librerías necesarias
const bcrypt = require('bcrypt');          // Para encriptar contraseñas
const jwt = require('jsonwebtoken');       // Para generar tokens de autenticación
const xss = require('xss'); 

// Importamos el modelo de usuario (acceso a BD)
const userModel = require('../models/userModel');


// =======================
// 🟢 REGISTRO DE USUARIO
// =======================

const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Faltan datos' });
    }

    const cleanNombre = xss(nombre.trim());
    const cleanEmail = xss(email.trim().toLowerCase());

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ message: 'Email inválido' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password demasiado corta' });
    }

    const existingUser = await userModel.getUserByEmail(cleanEmail);

    if (existingUser) {
      return res.status(400).json({ message: 'Usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userModel.createUser(cleanNombre, cleanEmail, hashedPassword, 'Cliente');

    res.json({ success: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error servidor' });
  }
};


// =======================
// 🔵 LOGIN DE USUARIO
// =======================

const login = async (req, res) => {
  try {
    // Extraemos datos del body
    const { email, password } = req.body;

    // 🔹 Validación básica
    if (!email || !password) {
      return res.status(400).json({ message: 'Faltan datos' });
    }

    // 🔍 Buscamos usuario en la base de datos
    const user = await userModel.getUserByEmail(email);

    // ❌ Si no existe, error genérico (mejor práctica de seguridad)
    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // 🔐 Comparamos contraseña introducida con la hasheada
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // 🔑 Generamos token JWT con datos del usuario
    const token = jwt.sign(
      {
        idUser: user.id_user,           // ID del usuario
        role: user.rol.toLowerCase()   // Rol normalizado
      },
      process.env.JWT_SECRET,          // Clave secreta
      { expiresIn: '2h' }              // Expira en 2 horas
    );

    // Enviamos token al frontend
    res.json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error servidor' });
  }
};


// Exportamos funciones para usarlas en las rutas
module.exports = { register, login };