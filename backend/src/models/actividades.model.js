const db = require("../config/db");


const insert = async ({
    persona_mayor_id,
    nombre,
    categoria,
    descripcion,
    es_recurrente,
    creado_por,
    fecha_creacion
}) => {
    const [result] = await db.query(
        "INSERT INTO actividad (persona_mayor_id, nombre, categoria, descripcion, es_recurrente, creado_por, fecha_creacion) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
            persona_mayor_id,
            nombre,
            categoria,
            descripcion,
            es_recurrente,
            creado_por,
            fecha_creacion
        ]
    );
    return result;
};

const selectById = async (id) => {
    const [result] = await db.query("SELECT * FROM actividad WHERE id = ?", [
        id,
    ]);
    if (result.length === 0) return null;
    return result[0];
};

const selectByPersonaMayorId = async (persona_mayor_id) => {
    const [result] = await db.query("SELECT * FROM actividad WHERE persona_mayor_id = ?", [persona_mayor_id]);
    return result;
};

const update = async (id, datosActualizados) => {
    const {
        nombre,
        categoria,
        descripcion,
        es_recurrente,
        modificado_por,
        fecha_modificacion
    } = datosActualizados;

    const query = `
    UPDATE actividad
    SET nombre = ?, categoria = ?, descripcion = ?, es_recurrente = ?, modificado_por = ?, fecha_modificacion = ?
    WHERE id = ?
  `;

    const [result] = await db.query(query, [
        nombre,
        categoria,
        descripcion,
        es_recurrente,
        modificado_por,
        fecha_modificacion,
        id
    ]);

    return result;
};

const remove = async (id) => {
    const query = "DELETE FROM actividad WHERE id = ?";
    const [result] = await db.query(query, [id]);
    return result;
};


module.exports = { insert, selectById, selectByPersonaMayorId, update, remove };