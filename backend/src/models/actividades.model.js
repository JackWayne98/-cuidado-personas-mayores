const db = require("../config/db");

const insert = async ({
  nombre,
  categoria,
  descripcion,
  creado_por,
  fecha_creacion,
}) => {
  const [result] = await db.query(
    "INSERT INTO actividad (nombre, categoria, descripcion, creado_por, fecha_creacion) VALUES (?, ?, ?, ?, ?)",
    [nombre, categoria, descripcion, creado_por, fecha_creacion]
  );
  return result;
};

const selectById = async (id) => {
  const [result] = await db.query("SELECT * FROM actividad WHERE id = ?", [id]);
  if (result.length === 0) return null;
  return result[0];
};

const selectByUser = async (perfil_usuario_id) => {
  const [result] = await db.query(
    "SELECT DISTINCT a.nombre FROM evento_actividad ea JOIN actividad a ON ea.actividad_id = a.id WHERE ea.perfil_usuario_id = ? ORDER BY a.nombre;",
    [perfil_usuario_id]
  );
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

module.exports = { insert, selectById, selectByUser, update, remove };
