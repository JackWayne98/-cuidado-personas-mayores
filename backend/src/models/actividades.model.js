const db = require("../config/db");

const insert = async ({
  nombre,
  categoria,
  descripcion,
  perfil_usuario_id,
  creado_por,
  fecha_creacion,
}) => {
  const [result] = await db.query(
    "INSERT INTO actividad (nombre, categoria, descripcion, perfil_usuario_id, creado_por, fecha_creacion) VALUES (?, ?, ?, ?, ?, ?)",
    [
      nombre,
      categoria,
      descripcion,
      perfil_usuario_id,
      creado_por,
      fecha_creacion,
    ]
  );
  return result;
};

const findByUniqueFields = async (nombre, categoria, descripcion) => {
  const [result] = await db.query(
    "SELECT * FROM actividad WHERE nombre = ? AND categoria = ? AND descripcion = ?",
    [nombre, categoria, descripcion]
  );
  return result[0];
};

const selectById = async (id) => {
  const [result] = await db.query("SELECT * FROM actividad WHERE id = ?", [id]);
  if (result.length === 0) return null;
  return result[0];
};

const selectByUser = async (perfil_usuario_id) => {
  const [result] = await db.query(
    "SELECT * FROM actividad WHERE perfil_usuario_id = ? ORDER BY nombre ASC",
    [perfil_usuario_id]
  );
  return result;
};

const selectAll = async () => {
  const [result] = await db.query("SELECT * FROM actividad");
  return result;
};

const update = async (id, datosActualizados) => {
  const { nombre, categoria, descripcion, modificado_por, fecha_modificacion } =
    datosActualizados;

  const query = `
    UPDATE actividad
    SET nombre = ?, categoria = ?, descripcion = ?, modificado_por = ?, fecha_modificacion = ?
    WHERE id = ?
  `;

  const [result] = await db.query(query, [
    nombre,
    categoria,
    descripcion,
    modificado_por,
    fecha_modificacion,
    id,
  ]);

  return result;
};

const remove = async (id) => {
  const query = "DELETE FROM actividad WHERE id = ?";
  const [result] = await db.query(query, [id]);
  return result;
};

module.exports = {
  insert,
  selectById,
  selectByUser,
  update,
  remove,
  selectAll,
  findByUniqueFields,
};
