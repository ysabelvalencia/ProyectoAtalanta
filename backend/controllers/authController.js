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
    let { user_name, email, password } = req.body;

    if (!user_name || !email || !password) {
      return res.status(400).json({ message: 'Faltan datos' });
    }

    const cleanUserName = xss(user_name.trim()).slice(0, 100);
    const cleanEmail = xss(email.trim().toLowerCase());

    if (!validator.isEmail(cleanEmail)) {
      return res.status(400).json({ message: 'Email inválido' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password demasiado corta' });
    }

    const existingUser = await userModel.getUserByEmail(cleanEmail);

    if (existingUser) {
      return res.status(409).json({ message: 'Usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // YA NO PASAMOS ROLE
    const newUserId = await userModel.createUser(
      cleanUserName,
      cleanEmail,
      hashedPassword
    );

    const token = jwt.sign(
      {
        idUser: newUserId,
        role: 'cliente' // 👈 porque default = cliente
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      token,
      user: {
        id: newUserId,
        user_name: cleanUserName,
        email: cleanEmail,
        role: 'cliente'
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

    if (!email || !password) {
      return res.status(400).json({ message: 'Faltan datos' });
    }

    const cleanEmail = xss(email.trim().toLowerCase());

    if (!validator.isEmail(cleanEmail)) {
      return res.status(400).json({ message: 'Email inválido' });
    }

    const user = await userModel.getUserByEmail(cleanEmail);

    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      {
        idUser: user.id_user,
        role: user.role_name // 🔥 aquí el cambio importante
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '2h'
      }
    );

    return res.json({
      message: 'Login correcto',
      token,
      user: {
        id: user.id_user,
        user_name: user.user_name,
        email: user.email,
        role: user.role_name
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ message: 'Error servidor' });
  }
};


module.exports = {
  register,
  login
};