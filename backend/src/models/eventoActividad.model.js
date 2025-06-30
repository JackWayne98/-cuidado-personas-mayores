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
  fecha_modificacion,
  grupo_recurrencia_id = null
) => {
  const result = await db.query(
    "INSERT INTO evento_actividad (actividad_id,perfil_usuario_id,fecha_inicio, fecha_fin, recordatorio, estado, creado_por, modificado_por, fecha_creacion, fecha_modificacion, grupo_recurrencia_id) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
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
      grupo_recurrencia_id,
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

const put = async (id, data) => {
  const {
    fecha_inicio,
    fecha_fin,
    recordatorio,
    modificado_por,
    fecha_modificacion,
  } = data;

  const [result] = await db.query(
    "UPDATE evento_actividad SET fecha_inicio = ?, fecha_fin = ?, recordatorio = ?, modificado_por = ?, fecha_modificacion=? WHERE id = ?",
    [
      fecha_inicio,
      fecha_fin,
      recordatorio,
      modificado_por,
      fecha_modificacion,
      id,
    ]
  );

  return result;
};

const putStatus = async (id, estado, modificado_por, fecha_modificacion) => {
  const [result] = await db.query(
    "UPDATE evento_actividad SET estado = ?, modificado_por = ?, fecha_modificacion= ? WHERE id = ?",
    [estado, modificado_por, fecha_modificacion, id]
  );
  return result;
};

const deleteEventoActividad = async (id) => {
  const result = await db.query("DELETE FROM evento_actividad WHERE id = ?", [
    id,
  ]);
  return result[0];
};

const deletebyRecurrentGroup = async (grupo_recurrencia_id) => {
  const [result] = await db.query(
    "DELETE FROM evento_actividad WHERE grupo_recurrencia_id = ?",[grupo_recurrencia_id]
  );
  return result;
};

module.exports = {
  selectByUser,
  selectById,
  insertEventoActividad,
  put,
  putStatus,
  deleteEventoActividad,
  deletebyRecurrentGroup
};
