const db = require("../config/db");

const selectById = async (userId) => {
  const [result] = await db.query("SELECT * FROM perfil_usuario WHERE id = ?", [
    userId,
  ]);
  if (result.length === 0) return null;
  return result[0];
};

const selectByEmail = async (email) => {
  const [result] = await db.query("SELECT * FROM perfil_usuario WHERE correo =?", [email]);
  if (result.length === 0) return null;
  return result[0];
};

const insert = async ({ name, lastname, email, phone, password }) => {
  const [result] = await db.query(
    "INSERT INTO perfil_usuario (nombre, apellido, correo, telefono, password) VALUES (?, ?, ?, ?, ?)",
    [name, lastname, email, phone, password]
  );

<<<<<<< Updated upstream
  return result[0];
=======
  return result;
>>>>>>> Stashed changes
};

module.exports = { selectById, selectByEmail, insert };
