const db = require("../config/db");

const insert = async ({
  nombre,
  apellido,
  fecha_nacimiento,
  genero,
  movilidad,
  condiciones_medicas,
  notas_generales,
  creado_por,
  modificado_por,
  fecha_creacion,
  fecha_modificacion,
}) => {
  const [result] = await db.query(
    "INSERT INTO persona_mayor (nombre, apellido, fecha_nacimiento, genero, movilidad, condiciones_medicas, notas_generales, creado_por, modificado_por, fecha_creacion, fecha_modificacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      nombre,
      apellido,
      fecha_nacimiento,
      genero,
      movilidad,
      condiciones_medicas,
      notas_generales,
      creado_por,
      modificado_por,
      fecha_creacion,
      fecha_modificacion,
    ]
  );
  return result;
};

const selectById = async (persona_mayor_id) => {
  const [result] = await db.query("SELECT * FROM persona_mayor WHERE id = ?", [
    persona_mayor_id,
  ]);
  if (result.length === 0) return null;
  return result[0];
};

const selectByUser = async (perfil_usuario_id) => {
  const [result] = await db.query(
    "SELECT pm.* FROM persona_mayor pm INNER JOIN persona_usuario pu ON pm.id = pu.persona_mayor_id WHERE pu.perfil_usuario_id = ?",
    [perfil_usuario_id]
  );
  return result;
};

const update = async (persona_mayor_id, data) => {
  const {
    nombre,
    apellido,
    fecha_nacimiento,
    genero,
    movilidad,
    condiciones_medicas,
    notas_generales,
    modificado_por,
    fecha_modificacion,
  } = data;

  const [result] = await db.query(
    `UPDATE persona_mayor 
     SET nombre = ?, apellido = ?, fecha_nacimiento = ?, genero = ?, movilidad = ?, 
         condiciones_medicas = ?, notas_generales = ?, modificado_por = ?, fecha_modificacion = ?
     WHERE id = ?`,
    [
      nombre,
      apellido,
      fecha_nacimiento,
      genero,
      movilidad,
      condiciones_medicas,
      notas_generales,
      modificado_por,
      fecha_modificacion,
      persona_mayor_id,
    ]
  );
  return result;
};

const deleteById = async (persona_mayor_id) => {
  await db.query(
    `DELETE ea FROM evento_actividad ea
     JOIN actividad a ON ea.actividad_id = a.id
     WHERE a.persona_mayor_id = ?`,
    [persona_mayor_id]
  );

  await db.query(`DELETE FROM actividad WHERE persona_mayor_id = ?`, [
    persona_mayor_id,
  ]);

  await db.query(`DELETE FROM contacto_emergencia WHERE persona_mayor_id = ?`, [
    persona_mayor_id,
  ]);

  await db.query(`DELETE FROM dieta_alimenticia WHERE persona_mayor_id = ?`, [
    persona_mayor_id,
  ]);

  await db.query(`DELETE FROM receta_medica WHERE persona_mayor_id = ?`, [
    persona_mayor_id,
  ]);

  await db.query(`DELETE FROM rutina_compartida WHERE persona_mayor_id = ?`, [
    persona_mayor_id,
  ]);

  await db.query(`DELETE FROM persona_usuario WHERE persona_mayor_id = ?`, [
    persona_mayor_id,
  ]);

  const [result] = await db.query(`DELETE FROM persona_mayor WHERE id = ?`, [
    persona_mayor_id,
  ]);

  return result;
};

module.exports = { selectById, selectByUser, insert, update, deleteById };
