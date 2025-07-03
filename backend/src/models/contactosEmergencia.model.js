const db = require('../config/db');

const insert = async ({
    persona_mayor_id,
    nombre,
    telefono,
    relacion,
    es_medico,
    creado_por,
    modificado_por,
    fecha_creacion,
    fecha_modificacion
}) => {
    const query = `
        INSERT INTO contacto_emergencia
        (persona_mayor_id, nombre, telefono, relacion, es_medico, creado_por, modificado_por, fecha_creacion, fecha_modificacion)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
        persona_mayor_id,
        nombre,
        telefono,
        relacion,
        es_medico,
        creado_por,
        modificado_por,
        fecha_creacion,
        fecha_modificacion
    ]);

    return result;
};

const selectById = async (id) => {
    const query = `SELECT * FROM contacto_emergencia WHERE id = ?`;
    const [rows] = await db.query(query, [id]);
    return rows[0];
};

const selectByPersonaMayorId = async (persona_mayor_id) => {
    const query = `SELECT * FROM contacto_emergencia WHERE persona_mayor_id = ?`;
    const [rows] = await db.query(query, [persona_mayor_id]);
    return rows;
};

const update = async (id, datos) => {
    const {
        nombre,
        telefono,
        relacion,
        es_medico,
        modificado_por,
        fecha_modificacion
    } = datos;

    const query = `
        UPDATE contacto_emergencia
        SET nombre = ?, telefono = ?, relacion = ?, es_medico = ?, modificado_por = ?, fecha_modificacion = ?
        WHERE id = ?
    `;

    const [result] = await db.query(query, [
        nombre,
        telefono,
        relacion,
        es_medico,
        modificado_por,
        fecha_modificacion,
        id
    ]);

    return result;
};

const remove = async (id) => {
    const query = `DELETE FROM contacto_emergencia WHERE id = ?`;
    const [result] = await db.query(query, [id]);
    return result;
};

module.exports = { insert, selectById, selectByPersonaMayorId, update, remove };