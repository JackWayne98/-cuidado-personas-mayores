const db = require("../config/db");

const insertEventoActividad = async (
  actividad_id,
  perfil_usuario_id,
  fecha_inicio,
  fecha_fin,
  recordatorio,
  estado,
  creado_por,
  modificado_por,
  fecha_creacion,
  fecha_modificacion
) => {
  const result = await db.query(
    "INSERT INTO evento_actividad (actividad_id,perfil_usuario_id,fecha_inicio, fecha_fin, recordatorio, estado, creado_por, modificado_por, fecha_creacion, fecha_modificacion) VALUES (?,?,?,?,?,?,?,?,?,?)",
    [
      actividad_id,
      perfil_usuario_id,
      fecha_inicio,
      fecha_fin,
      recordatorio,
      estado,
      creado_por,
      modificado_por,
      fecha_creacion,
      fecha_modificacion,
    ]
  );
  return result[0];
};

const selectByUser = async (perfil_usuario_id) => {
  const [result] = await db.query(
    "SELECT * FROM evento_actividad WHERE perfil_usuario_id = ?",
    [perfil_usuario_id]
  );
  return result;
};

const selectById = async (id) => {
  const [result] = await db.query(
    "SELECT * FROM evento_actividad WHERE id = ?",
    [id]
  );
  return result.length > 0 ? result[0] : null;
};

module.exports = { selectByUser, selectById, insertEventoActividad };
