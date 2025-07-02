const dayjs = require("dayjs");
const Contacto = require("../models/contactosEmergencia.model");
const PersonaMayor = require("../models/personasMayores.model");

const create = async (req, res) => {
    try {
        const {
            persona_mayor_id,
            nombre,
            telefono,
            relacion,
            es_medico
        } = req.body;

        const personaMayor = await PersonaMayor.selectById(persona_mayor_id);
        if (!personaMayor) {
            return res.status(400).json({
                success: false,
                message: "El ID de persona mayor proporcionado no existe"
            });
        }

        const creado_por = req.user.id;
        const modificado_por = req.user.id;
        const fecha_creacion = dayjs().format("YYYY-MM-DD HH:mm:ss");
        const fecha_modificacion = fecha_creacion;

        const nuevoContacto = {
            persona_mayor_id,
            nombre,
            telefono,
            relacion,
            es_medico,
            creado_por,
            modificado_por,
            fecha_creacion,
            fecha_modificacion
        };

        const result = await Contacto.insert(nuevoContacto);
        const contactoId = result.insertId;
        const contacto = await Contacto.selectById(contactoId);

        res.status(201).json({
            success: true,
            message: "Contacto de emergencia creado correctamente",
            contacto
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getByElderId = async (req, res) => {
    try {
        const { elderId } = req.params;

        const personaMayor = await PersonaMayor.selectById(elderId);
        if (!personaMayor) {
            return res.status(404).json({
                success: false,
                message: "La persona mayor con ese ID no existe"
            });
        }

        const contactos = await Contacto.selectByPersonaMayorId(elderId);

        res.status(200).json({
            success: true,
            contactos
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const contacto = await Contacto.selectById(id);

        if (!contacto) {
            return res.status(404).json({
                success: false,
                message: "No se encontró un contacto con ese ID"
            });
        }

        res.status(200).json({
            success: true,
            contacto
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            nombre,
            telefono,
            relacion,
            es_medico
        } = req.body;

        const contacto = await Contacto.selectById(id);
        if (!contacto) {
            return res.status(404).json({
                success: false,
                message: "El contacto de emergencia no existe"
            });
        }

        const modificado_por = req.user.id;
        const fecha_modificacion = dayjs().format("YYYY-MM-DD HH:mm:ss");

        const datos = {
            nombre,
            telefono,
            relacion,
            es_medico,
            modificado_por,
            fecha_modificacion
        };

        await Contacto.update(id, datos);
        const contactoActualizado = await Contacto.selectById(id);

        res.status(200).json({
            success: true,
            message: "Contacto de emergencia actualizado correctamente",
            contacto: contactoActualizado
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.params;

        const contacto = await Contacto.selectById(id);
        if (!contacto) {
            return res.status(404).json({
                success: false,
                message: "El contacto de emergencia no existe"
            });
        }

        await Contacto.remove(id);

        res.status(200).json({
            success: true,
            message: "Contacto de emergencia eliminado correctamente"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { create, getByElderId, getById, update, remove };