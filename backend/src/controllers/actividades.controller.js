const dayjs = require("dayjs");

const Actividad = require("../models/actividades.model");
const PersonaMayor = require("../models/personasMayores.model");

const create = async (req, res) => {
    try {
        const {
            persona_mayor_id,
            nombre,
            categoria,
            descripcion,
            es_recurrente
        } = req.body;

        // validar si  persona mayor existe
        const personaMayor = await PersonaMayor.selectById(persona_mayor_id);
        if (!personaMayor) {
            return res.status(400).json({
                success: false,
                message: "El ID de persona mayor proporcionado no existe"
            });
        }

        // validar categorias
        const categoriasValidas = ['medicación', 'terapia', 'ejercicio', 'alimentación', 'descanso', 'visita', 'ocio'];

        if (!categoriasValidas.includes(categoria)) {
            return res.status(400).json({
                success: false,
                message: `Categoría inválida. Debe ser una de: ${categoriasValidas.join(", ")}`
            });
        }

        const fecha_creacion = dayjs().format("YYYY-MM-DD HH:mm:ss");
        const creado_por = req.user.id;

        const nuevaActividad = {
            persona_mayor_id,
            nombre,
            categoria,
            descripcion,
            es_recurrente,
            creado_por,
            fecha_creacion
        };

        // Aquí delegas la lógica de inserción al modelo:
        const result = await Actividad.insert(nuevaActividad);
        const actividadId = result.insertId;
        const actividad = await Actividad.selectById(actividadId);

        res.status(201).json({
            success: true,
            message: "Actividad creada correctamente",
            actividad
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getByElderId = async (req, res) => {
    try {
        const { elderId } = req.params;

        // Validar si la persona mayor existe
        const personaMayor = await PersonaMayor.selectById(elderId);
        if (!personaMayor) {
            return res.status(404).json({
                success: false,
                message: "La persona mayor no existe"
            });
        }

        // Obtener actividades asociadas
        const actividades = await Actividad.selectByPersonaMayorId(elderId);

        res.status(200).json({
            success: true,
            actividades
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const { id } = req.params;

        const actividad = await Actividad.selectById(id);

        if (!actividad) {
            return res.status(404).json({
                success: false,
                message: "La actividad no existe"
            });
        }

        res.status(200).json({
            success: true,
            actividad
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
            categoria,
            descripcion,
            es_recurrente
        } = req.body;

        // Validar si la actividad existe
        const actividadExistente = await Actividad.selectById(id);
        if (!actividadExistente) {
            return res.status(404).json({
                success: false,
                message: "La actividad no existe"
            });
        }

        // Validar categoría
        const categoriasValidas = ['medicación', 'terapia', 'ejercicio', 'alimentación', 'descanso', 'visita', 'ocio'];
        if (!categoriasValidas.includes(categoria)) {
            return res.status(400).json({
                success: false,
                message: `Categoría inválida. Debe ser una de: ${categoriasValidas.join(", ")}`
            });
        }

        const modificado_por = req.user.id;
        const fecha_modificacion = dayjs().format("YYYY-MM-DD HH:mm:ss");

        const datosActualizados = {
            nombre,
            categoria,
            descripcion,
            es_recurrente,
            modificado_por,
            fecha_modificacion
        };

        await Actividad.update(id, datosActualizados);

        const actividadActualizada = await Actividad.selectById(id);

        res.status(200).json({
            success: true,
            message: "Actividad actualizada correctamente",
            actividad: actividadActualizada
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si la actividad existe
        const actividad = await Actividad.selectById(id);
        if (!actividad) {
            return res.status(404).json({
                success: false,
                message: "La actividad no existe"
            });
        }

        await Actividad.remove(id);

        res.status(200).json({
            success: true,
            message: "Actividad eliminada correctamente"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { create, getByElderId, getById, update, remove };