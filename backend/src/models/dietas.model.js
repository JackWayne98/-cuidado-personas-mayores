const db = require('../config/db');

const insert = async ({
    persona_mayor_id,
    descripcion,
    restricciones,
    recomendaciones,
    fecha_inicio,
    fecha_fin,
    creado_por,
    modificado_por,
    fecha_creacion,
    fecha_modificacion
}) => {
    const query = `
        INSERT INTO dieta_alimenticia
        (persona_mayor_id, descripcion, restricciones, recomendaciones, fecha_inicio, fecha_fin, creado_por, modificado_por, fecha_creacion, fecha_modificacion)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
        persona_mayor_id,
        descripcion,
        restricciones,
        recomendaciones,
        fecha_inicio,
        fecha_fin,
        creado_por,
        modificado_por,
        fecha_creacion,
        fecha_modificacion
    ]);

    return result;
};

const selectById = async (id) => {
    const query = `SELECT * FROM dieta_alimenticia WHERE id = ?`;
    const [rows] = await db.query(query, [id]);
    return rows[0];
};

const selectByPersonaMayorId = async (persona_mayor_id) => {
    const query = `SELECT * FROM dieta_alimenticia WHERE persona_mayor_id = ?`;
    const [rows] = await db.query(query, [persona_mayor_id]);
    return rows;
};

const update = async (id, datos) => {
    const {
        descripcion,
        restricciones,
        recomendaciones,
        fecha_inicio,
        fecha_fin,
        es_activa,
        modificado_por,
        fecha_modificacion
    } = datos;

    const query = `
        UPDATE dieta_alimenticia
        SET descripcion = ?, restricciones = ?, recomendaciones = ?, fecha_inicio = ?, fecha_fin = ?, es_activa = ?, modificado_por = ?, fecha_modificacion = ?
        WHERE id = ?
    `;

    const [result] = await db.query(query, [
        descripcion,
        restricciones,
        recomendaciones,
        fecha_inicio,
        fecha_fin,
        es_activa,
        modificado_por,
        fecha_modificacion,
        id
    ]);

    return result;
};

const remove = async (id) => {
    const query = `DELETE FROM dieta_alimenticia WHERE id = ?`;
    const [result] = await db.query(query, [id]);
    return result;
};

module.exports = { insert, selectById, selectByPersonaMayorId, update, remove };