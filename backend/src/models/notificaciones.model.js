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
