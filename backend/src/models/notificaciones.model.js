
const db = require("../config/db");

const insert = async (
  evento_actividad_id,
  perfil_usuario_id,
  mensaje,
  fecha_envio,
  leida
) => {
  const [result] = await db.query(
    "INSERT INTO notificacion (evento_actividad_id, perfil_usuario_id, mensaje, fecha_envio, leida) VALUES (?,?,?,?,?)",
    [evento_actividad_id, perfil_usuario_id, mensaje, fecha_envio, leida]
  );
  return result;
};

const selectById = async (id)=>{
  const [rows] = await db.query(
    "SELECT * FROM notificacion WHERE id = ?",
    [id]
  );
  return rows[0];
  
}

const putAsRead = async (id)=>{
  const [result] = await db.query(
    "UPDATE notificacion SET leida = 1 WHERE id = ?",
    [id]
  );
  return result;

}
module.exports = { insert, selectById, putAsRead };
