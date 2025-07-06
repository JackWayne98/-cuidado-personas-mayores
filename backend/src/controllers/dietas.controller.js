const dayjs = require("dayjs");
const Dieta = require("../models/dietas.model");
const PersonaMayor = require("../models/personasMayores.model");

const create = async (req, res) => {
    try {
        const {
            persona_mayor_id,
            descripcion,
            restricciones,
            recomendaciones,
            fecha_inicio,
            fecha_fin
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

        const nuevaDieta = {
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
        };

        const result = await Dieta.insert(nuevaDieta);
        const dietaId = result.insertId;
        const dieta = await Dieta.selectById(dietaId);

        res.status(201).json({
            success: true,
            message: "Dieta alimenticia creada correctamente",
            dieta
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

        const dietas = await Dieta.selectByPersonaMayorId(elderId);

        res.status(200).json({
            success: true,
            dietas
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const dieta = await Dieta.selectById(id);

        if (!dieta) {
            return res.status(404).json({
                success: false,
                message: "No se encontró una dieta alimenticia con ese ID"
            });
        }

        res.status(200).json({
            success: true,
            dieta
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            descripcion,
            restricciones,
            recomendaciones,
            fecha_inicio,
            fecha_fin,
            es_activa
        } = req.body;

        const dieta = await Dieta.selectById(id);
        if (!dieta) {
            return res.status(404).json({
                success: false,
                message: "La dieta alimenticia no existe"
            });
        }

        const modificado_por = req.user.id;
        const fecha_modificacion = dayjs().format("YYYY-MM-DD HH:mm:ss");

        const datos = {
            descripcion,
            restricciones,
            recomendaciones,
            fecha_inicio,
            fecha_fin,
            es_activa,
            modificado_por,
            fecha_modificacion
        };

        await Dieta.update(id, datos);
        const dietaActualizada = await Dieta.selectById(id);

        res.status(200).json({
            success: true,
            message: "Dieta alimenticia actualizada correctamente",
            dieta: dietaActualizada
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.params;

        const dieta = await Dieta.selectById(id);
        if (!dieta) {
            return res.status(404).json({
                success: false,
                message: "La dieta alimenticia no existe"
            });
        }

        await Dieta.remove(id);

        res.status(200).json({
            success: true,
            message: "Dieta alimenticia eliminada correctamente"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { create, getByElderId, getById, update, remove };