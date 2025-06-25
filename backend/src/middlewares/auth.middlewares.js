const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuarios.model");

const checkToken = async (req, res, next) => {
  if (!req.headers["authorization"]) {
    return res.status(403).json({
      message:
        "La cabecera de Autorización es necesaria para acceder a este recurso",
    });
  }
  const token = req.headers["authorization"];
  let payload;
  const secret = process.env.JWT_SECRET;
  
  try {
    payload= jwt.verify(token, secret)
    
  } catch (error) {
    return res.status(403).json({
      message: "Token no es válido",
    });
  }

 
  try {
    const usuario = await Usuario.selectById(payload.user_id);
    console.log(usuario);
    if (!usuario) {
      return res.status(403).json({
        message: "El Usuario No Existe",
      });
    }
    req.user = usuario; 
    console.log("Usuario en middleware:", req.user);

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Error al verificar el usuario",
      error: error.message,
    });
  }

};

module.exports = { checkToken};