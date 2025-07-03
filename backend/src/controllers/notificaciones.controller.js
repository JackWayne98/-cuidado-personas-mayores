const Notificacion = require("../models/notificacion.model.js");

const create = async (req, res) => {
    const {evento_actividad_id, mensaje, fecha_envio, leida} = req.body
    Notificacion.insert()
};Cambios

module.exports = { create };

