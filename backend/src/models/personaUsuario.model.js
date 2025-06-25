const db = require("../config/db");

const insert = async (persona_mayor_id, perfil_usuario_id, relacion) => {
  const [result] = await db.query(
    "INSERT INTO persona_usuario (persona_mayor_id, perfil_usuario_id, relacion) VALUES (?, ?, ?)",
    [persona_mayor_id, perfil_usuario_id, relacion]
  );

  return result;
};

module.exports = { insert };
