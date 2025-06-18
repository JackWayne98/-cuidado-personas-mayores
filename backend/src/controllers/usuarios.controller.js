const bcrypt = require("bcryptjs");

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

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getAll, getById, register };
