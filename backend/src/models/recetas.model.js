const db = require("../config/db");

const insert = async ({
    persona_mayor_id,
    medicamento,
    dosis,
    frecuencia,
    fecha_inicio,
    fecha_fin,
    prescrita_por,
    archivo_pdf,
    creado_por,
    modificado_por,
    fecha_creacion,
    fecha_modificacion
}) => {
    const query = `
        INSERT INTO receta_medica 
        (persona_mayor_id, medicamento, dosis, frecuencia, fecha_inicio, fecha_fin, prescrita_por, archivo_pdf, creado_por, modificado_por, fecha_creacion, fecha_modificacion)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
        persona_mayor_id,
        medicamento,
        dosis,
        frecuencia,
        fecha_inicio,
        fecha_fin,
        prescrita_por,
        archivo_pdf,
        creado_por,
        modificado_por,
        fecha_creacion,
        fecha_modificacion
    ]);

    return result;
};

const selectById = async (id) => {
    const query = `
        SELECT * FROM receta_medica
        WHERE id = ?
    `;

    const [rows] = await db.query(query, [id]);
    return rows[0];
};

const selectByPersonaMayorId = async (persona_mayor_id) => {
    const query = `
        SELECT * FROM receta_medica
        WHERE persona_mayor_id = ?
    `;

    const [rows] = await db.query(query, [persona_mayor_id]);
    return rows;
};

const update = async (id, datos) => {
    const query = `
        UPDATE receta_medica
        SET medicamento = ?, dosis = ?, frecuencia = ?, fecha_inicio = ?, fecha_fin = ?, prescrita_por = ?, archivo_pdf = ?, modificado_por = ?, fecha_modificacion = ?
        WHERE id = ?
    `;

    const {
        medicamento,
        dosis,
        frecuencia,
        fecha_inicio,
        fecha_fin,
        prescrita_por,
        archivo_pdf,
        modificado_por,
        fecha_modificacion
    } = datos;

    const [result] = await db.query(query, [
        medicamento,
        dosis,
        frecuencia,
        fecha_inicio,
        fecha_fin,
        prescrita_por,
        archivo_pdf,
        modificado_por,
        fecha_modificacion,
        id
    ]);

    return result;
};

const remove = async (id) => {
    const query = `
        DELETE FROM receta_medica
        WHERE id = ?
    `;

    const [result] = await db.query(query, [id]);
    return result;
};

module.exports = { insert, selectById, selectByPersonaMayorId, update, remove };