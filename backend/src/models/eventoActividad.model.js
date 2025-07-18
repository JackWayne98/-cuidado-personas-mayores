const db = require("../config/db");

const insertEventoActividad = async (
  actividad_id,
  persona_mayor_id,
  perfil_usuario_id,
  fecha_inicio,
  fecha_fin,
  recordatorio,
  estado,
  creado_por,
  modificado_por,
  fecha_creacion,
  fecha_modificacion,
  grupo_recurrencia_id = null,
  intervalo_horas = null,
  repeticiones = null
) => {
  const [result] = await db.query(
    "INSERT INTO evento_actividad (actividad_id, persona_mayor_id, perfil_usuario_id, fecha_inicio, fecha_fin, recordatorio, estado, creado_por, modificado_por, fecha_creacion, fecha_modificacion, grupo_recurrencia_id, intervalo_horas, repeticiones) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      actividad_id,
      persona_mayor_id,
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
      intervalo_horas,
      repeticiones,
    ]
  );
  return result;
};

const selectByUser = async (perfil_usuario_id) => {
  const [result] = await db.query(
    `SELECT * 
     FROM evento_actividad 
     WHERE perfil_usuario_id = ? 
     ORDER BY fecha_inicio ASC`,
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

const selectByRecurrentGroupId = async (grupo_recurrencia_id) => {
  const [result] = await db.query(
    "SELECT * FROM evento_actividad WHERE grupo_recurrencia_id = ?",
    [grupo_recurrencia_id]
  );
  return result;
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

const putRecurrentGroup = async (data, grupo_recurrencia_id) => {
  const {
    fecha_inicio,
    fecha_fin,
    recordatorio,
    modificado_por,
    fecha_modificacion,
  } = data;

  const [result] = await db.query(
    "UPDATE evento_actividad SET fecha_inicio = ?, fecha_fin = ?, recordatorio = ?, modificado_por = ?, fecha_modificacion = ? WHERE grupo_recurrencia_id = ?",
    [
      fecha_inicio,
      fecha_fin,
      recordatorio,
      modificado_por,
      fecha_modificacion,
      grupo_recurrencia_id,
    ]
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
    "DELETE FROM evento_actividad WHERE grupo_recurrencia_id = ?",
    [grupo_recurrencia_id]
  );
  return result;
};
//no empalmar eventos de actividad
const checkEventConflict = async (
  persona_mayor_id,
  fecha_inicio,
  fecha_fin
) => {
  const [result] = await db.query(
    `SELECT id
     FROM evento_actividad
     WHERE persona_mayor_id = ?
       AND (
         (fecha_inicio <= ? AND fecha_fin > ?)  -- overlaps start
         OR
         (fecha_inicio < ? AND fecha_fin >= ?)  -- overlaps end
         OR
         (fecha_inicio >= ? AND fecha_fin <= ?) -- fully inside
       )`,
    [
      persona_mayor_id,
      fecha_inicio,
      fecha_inicio,
      fecha_fin,
      fecha_fin,
      fecha_inicio,
      fecha_fin,
    ]
  );
  return result;
};

module.exports = {
  selectByUser,
  selectById,
  selectByRecurrentGroupId,
  insertEventoActividad,
  put,
  putStatus,
  putRecurrentGroup,
  deleteEventoActividad,
  deletebyRecurrentGroup,
  checkEventConflict,
};
