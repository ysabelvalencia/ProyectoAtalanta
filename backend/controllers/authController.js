/**
 * authController.js
 *
 * Este archivo contiene la lógica de negocio relacionada con la autenticación.
 * Gestiona el registro y login de usuarios, utilizando el modelo para acceder
 * a la base de datos y aplicando reglas como validación, hash de contraseñas
 * y generación de tokens JWT.
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userModel = require('../models/userModel');

// REGISTRO DE USUARIO
const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validación básica de datos
    if (!email || !password) {
      return res.status(400).json({ message: 'Faltan datos' });
    }
    // Evitar que cualquiera se registre como admin (seguridad básica)
    if (role === 'admin') {
      return res.status(403).json({ message: 'No permitido crear admin' });
    }

    // Comprobamos si el usuario ya existe
    const existingUser = await userModel.getUserByEmail(email);

    if (existingUser) {
      return res.json({ message: 'Usuario ya existe' });
    }

    // Hasheamos la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    // Guardamos el usuario en la base de datos
    await userModel.createUser(
      email,
      hashedPassword,
      role || 'cliente'
    );

    res.json({ success: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error servidor' });
  }
};

// LOGIN DE USUARIO
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscamos el usuario en la base de datos
    const user = await userModel.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    // Comparamos contraseña introducida con la hasheada
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Generamos un token JWT con información del usuario
    const token = jwt.sign(
      { idUser: user.idUser, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error servidor' });
  }
};

module.exports = { register, login };