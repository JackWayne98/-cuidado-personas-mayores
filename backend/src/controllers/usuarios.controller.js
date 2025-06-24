const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');

const Usuario = require("../models/usuarios.model");

const getAll = (req, res) => {
  // Implement your logic here
};

const getById = async (req, res) => {
  const { userId } = req.params;

  const user = await Usuario.selectById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Usuario no existe",
    });
  }
  res.json({
    user,
  });
};

const register = async (req, res) => {
  try {
    const { name, lastname, email, phone, password } = req.body;

    const existingUser = await Usuario.selectByEmail(email)
    if (existingUser) {
      return res.status(400).json({
        message: `No se puede registrar: el correo ${email} ya está en uso.`,
      });
    }
    const userData = {
      name,
      lastname,
      email,
      phone,
      password: bcrypt.hashSync(password, 10),
      role: "user",
    };

    const result = await Usuario.insert(userData);
    const user = await Usuario.selectById(result.insertId);

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await Usuario.selectByEmail(email);
  if (!user) {
    return res.status(401).json({
      message: 'Error usuario y/o contraseña'
    });
  }

  const equals = bcrypt.compareSync(password, user.password);
  if (!equals) {
    return res.status(401).json({
      message: 'Error usuario y/o password'
    });
  }

  const secret = process.env.JWT_SECRET;

  res.json({
    token: jwt.sign({
      user_id: user.id,
      rol: user.rol,
      exp: dayjs().add(5, "day").unix()
    }, secret)
  })

};

module.exports = { getAll, getById, register, login };
