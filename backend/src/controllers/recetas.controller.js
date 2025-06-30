const dayjs = require("dayjs");
const Receta = require("../models/recetas.model");
const PersonaMayor = require("../models/personasMayores.model");

const create = async (req, res) => {
    try {
        const {
            persona_mayor_id,
            medicamento,
            dosis,
            frecuencia,
            fecha_inicio,
            fecha_fin,
            prescrita_por,
            archivo_pdf
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

        const nuevaReceta = {
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
        };

        const result = await Receta.insert(nuevaReceta);
        const recetaId = result.insertId;
        const receta = await Receta.selectById(recetaId);

        res.status(201).json({
            success: true,
            message: "Receta médica creada correctamente",
            receta
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
                message: "La persona mayor no existe"
            });
        }

        const recetas = await Receta.selectByPersonaMayorId(elderId);

        res.status(200).json({
            success: true,
            recetas
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const { id } = req.params;

        const receta = await Receta.selectById(id);

        if (!receta) {
            return res.status(404).json({
                success: false,
                message: "La receta médica no existe"
            });
        }

        res.status(200).json({
            success: true,
            receta
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            medicamento,
            dosis,
            frecuencia,
            fecha_inicio,
            fecha_fin,
            prescrita_por,
            archivo_pdf
        } = req.body;

        const recetaExistente = await Receta.selectById(id);
        if (!recetaExistente) {
            return res.status(404).json({
                success: false,
                message: "La receta médica no existe"
            });
        }

        const modificado_por = req.user.id;
        const fecha_modificacion = dayjs().format("YYYY-MM-DD HH:mm:ss");

        const datosActualizados = {
            medicamento,
            dosis,
            frecuencia,
            fecha_inicio,
            fecha_fin,
            prescrita_por,
            archivo_pdf,
            modificado_por,
            fecha_modificacion
        };

        await Receta.update(id, datosActualizados);

        const recetaActualizada = await Receta.selectById(id);

        res.status(200).json({
            success: true,
            message: "Receta médica actualizada correctamente",
            receta: recetaActualizada
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.params;

        const receta = await Receta.selectById(id);
        if (!receta) {
            return res.status(404).json({
                success: false,
                message: "La receta médica no existe"
            });
        }

        await Receta.remove(id);

        res.status(200).json({
            success: true,
            message: "Receta médica eliminada correctamente"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { create, getByElderId, getById, update, remove };