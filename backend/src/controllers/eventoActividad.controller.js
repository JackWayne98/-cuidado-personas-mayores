const EventoActividad = require("../models/eventoActividad.model.js");
const dayjs = require("dayjs");
const { v4: uuidv4 } = require("uuid");

const {
  eventoActividadSchema,
} = require("../validators/eventoActividad.validator.js");
const {
  eventoActividadRecurrenteSchema,
} = require("../validators/eventoActividadRecurrente.validator.js");

const getByUser = async (req, res) => {
  try {
    const events = await EventoActividad.selectByUser(req.user.id);
    return res.json({
      message: "Eventos obtenidos correctamente",
      events,
    });
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    return res.status(500).json({
      message: "Hubo un error al obtener los eventos",
      error: error.message,
    });
  }
};

const getById = async (req, res) => {
  const { id } = req.params;
  const eventoActividad = await EventoActividad.selectById(id);
  if (!eventoActividad) {
    return res.status(404).json({
      message: "Evento no encontrado",
    });
  }
  return res.json({
    message: "Evento obtenido Correctamente",
    eventoActividad,
  });
};

const getByRecurrentGroupId = async (req, res) => {
  try {
    const { grupo_recurrencia_id } = req.params;
    if (!grupo_recurrencia_id) {
      return res.status(400).json({
        message: "El ID del grupo de recurrencia es requerido",
      });
    }
    const eventoActividades = await EventoActividad.selectByRecurrentGroupId(
      grupo_recurrencia_id
    );

    if (eventoActividades.length === 0) {
      return res.status(404).json({
        message:
          "No se encontraron eventos para el grupo de recurrencia proporcionado",
      });
    }
    return res.json({
      message: "Eventos Obtenidos Correctamente",
      eventoActividades,
    });
  } catch (error) {
    console.error("Error al obtener eventos recurrentes:", error);
    return res.status(500).json({
      message: "Hubo un error al obtener los eventos recurrentes",
      error: error.message,
    });
  }
};

const create = async (req, res) => {
  try {
    const { error, value } = eventoActividadSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: "Error en los datos enviados",
        details: error.details.map((e) => e.message),
      });
    }
    const { actividad_id, persona_mayor_id, fecha_inicio, fecha_fin, recordatorio } = value;

    const perfil_usuario_id = req.user.id;
    const creado_por = req.user.id;
    const modificado_por = creado_por;
    const fecha_creacion = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const fecha_modificacion = fecha_creacion;
    const estado = "pendiente";

    const result = await EventoActividad.insertEventoActividad(
      actividad_id,
      persona_mayor_id,
      perfil_usuario_id,
      fecha_inicio,
      fecha_fin,
      recordatorio,
      estado,
      creado_por,
      modificado_por,
      fecha_creacion,
      fecha_modificacion
    );

    const eventoCreado = await EventoActividad.selectById(result.insertId);

    return res.json({
      message: "Evento registrado correctamente",
      eventoCreado,
    });
  } catch (error) {
    console.error("Error al registrar evento:", error);
    res.status(500).json({
      message: "Hubo un error al registrar el evento",
      error: error.message,
    });
  }
};

const createRecurrentEvent = async (req, res) => {
  try {
    const { error, value } = eventoActividadRecurrenteSchema.validate(
      req.body,
      {
        abortEarly: false,
      }
    );
    if (error) {
      return res.status(400).json({
        message: "Error en los datos enviados",
        details: error.details.map((e) => e.message),
      });
    }
    const {
      actividad_id,
      persona_mayor_id,
      fecha_inicio,
      fecha_fin,
      recordatorio,
      intervalo_horas,
      repeticiones,
    } = value;

    const perfil_usuario_id = req.user.id;
    const creado_por = req.user.id;
    const modificado_por = creado_por;
    const fecha_creacion = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const fecha_modificacion = fecha_creacion;
    const estado = "pendiente";

    const grupo_recurrencia_id = uuidv4();
    console.log("Grupo recurrencia generado:", grupo_recurrencia_id);

    let inicio = dayjs(fecha_inicio);
    let fin = dayjs(fecha_fin);
    if (!inicio.isValid() || !fin.isValid()) {
      return res.status(400).json({
        message: "Las fechas proporcionadas no son válidas",
      });
    }

    const inserts = [];

    for (let i = 0; i < repeticiones; i++) {
      inserts.push(
        EventoActividad.insertEventoActividad(
          actividad_id,
          persona_mayor_id,
          perfil_usuario_id,
          inicio.format("YYYY-MM-DD HH:mm:ss"),
          fin.format("YYYY-MM-DD HH:mm:ss"),
          recordatorio,
          estado,
          creado_por,
          modificado_por,
          fecha_creacion,
          fecha_modificacion,
          grupo_recurrencia_id
        )
      );
      console.log(
        "Insertando evento con grupo_recurrencia_id:",
        grupo_recurrencia_id
      );
      inicio = inicio.add(intervalo_horas, "hour");
      fin = fin.add(intervalo_horas, "hour");
    }
    const eventos = await Promise.all(inserts);
    const eventosCreados = await EventoActividad.selectByRecurrentGroupId(
      grupo_recurrencia_id
    );

    res.status(201).json({
      message: "Eventos recurrentes registrados correctamente",
      grupo_recurrencia_id,
      eventosCreados,
    });
  } catch (err) {
    console.error("Error al registrar eventos recurrentes:", err);
    res.status(500).json({
      message: "Hubo un error en el registro de eventos recurrentes",
      error: err.message,
    });
  }
};

const edit = async (req, res) => {
  const { fecha_inicio, fecha_fin, recordatorio } = req.body;
  const eventoActividadId = req.params.id;
  const eventoActual = await EventoActividad.selectById(eventoActividadId);

  const modificado_por = req.user.id;
  const fecha_modificacion = dayjs().format("YYYY-MM-DD HH:mm:ss");

  const updatedEventoActividadData = {
    fecha_inicio,
    fecha_fin,
    recordatorio,
    modificado_por,
    fecha_modificacion,
    estado: eventoActual.estado,
  };

  try {
    const result = await EventoActividad.put(
      eventoActividadId,
      updatedEventoActividadData
    );

    const eventoActividadUpdated = await EventoActividad.selectById(
      eventoActividadId
    );

    return res.json({
      message: "Evento actualizado correctamente",
      eventoActividadUpdated,
    });
  } catch (err) {
    console.error("Error al actualizar evento:", err);
    return res.status(500).json({
      message: "Hubo un error al actualizar el evento",
      error: err.message,
    });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { estado } = req.body;
    const modificado_por = req.user.id;
    const fecha_modificacion = dayjs().format("YYYY-MM-DD HH:mm:ss");

    if (
      typeof estado !== "string" ||
      !["pendiente", "completado", "cancelado"].includes(estado)
    ) {
      return res.status(400).json({
        message: "El estado debe ser 'pendiente', 'completado' o 'cancelado'",
      });
    }
    const eventoActual = await EventoActividad.selectById(req.params.id);
    if (!eventoActual) {
      return res.status(404).json({
        message: "Evento no encontrado",
      });
    }

    const result = await EventoActividad.putStatus(
      req.params.id,
      estado,
      modificado_por,
      fecha_modificacion
    );
    const eventoActualizado = await EventoActividad.selectById(req.params.id);

    res.json({
      message: "Estado del evento actualizado correctamente",
      estado: eventoActualizado.estado,
    });
  } catch (error) {
    console.error("Error al actualizar el estado del evento:", error);
    return res.status(500).json({
      message: "Hubo un error al actualizar el estado del evento",
      error: error.message,
    });
  }
};

const updateRecurrentGroup = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin, recordatorio } = req.body;
    const modificado_por = req.user.id;
    const fecha_modificacion = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const grupo_recurrencia_id = req.params.grupo_recurrencia_id;

    if (!grupo_recurrencia_id) {
      return res.status(400).json({
        message: "El ID del grupo de recurrencia es requerido",
      });
    }

    const updatedEventoActividadData = {
      fecha_inicio,
      fecha_fin,
      recordatorio,
      modificado_por,
      fecha_modificacion,
    };

    const result = await EventoActividad.putRecurrentGroup(
      updatedEventoActividadData,
      grupo_recurrencia_id
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message:
          "No se encontraron eventos para actualizar con el grupo de recurrencia ingresado",
      });
    }

    const eventosActualizados = await EventoActividad.selectByRecurrentGroupId(
      grupo_recurrencia_id
    );
    return res.json({
      message: "Grupo de recurrencia actualizado correctamente",
      eventosActualizados,
    });
  } catch (err) {
    console.error("Error al actualizar grupo de recurrencia:", err);
    return res.status(500).json({
      message: "Hubo un error al actualizar el grupo de recurrencia",
      error: err.message,
    });
  }
};

const deleteEventoActividad = async (req, res) => {
  try {
    const eventoActividad = await EventoActividad.selectById(req.params.id);
    if (!eventoActividad) {
      return res.status(404).json({
        message: "Evento no encontrado",
      });
    }
    const result = await EventoActividad.deleteEventoActividad(req.params.id);
    return res.json({
      message: "Evento Eliminado Correctamente",
      eventoActividad,
    });
  } catch (err) {
    console.error("Error al eliminar evento:", err);
    res.status(500).json({
      message: "Hubo un error al eliminar el evento",
      error: err.message,
    });
  }
};

const deletebyRecurrentGroup = async (req, res) => {
  try {
    const { grupo_recurrencia_id } = req.params;
    if (!grupo_recurrencia_id) {
      return res.status(400).json({
        message: "El ID del grupo de recurrencia es requerido",
      });
    }

    const result = await EventoActividad.deletebyRecurrentGroup(
      grupo_recurrencia_id
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message:
          "No se encontraron eventos para eliminar con el grupo de recurrencia ingresado",
      });
    }
    return res.json({
      message: "Eventos recurrentes eliminados correctamente",
      grupo_recurrencia_id,
    });
  } catch (err) {
    console.error("Error al eliminar eventos recurrentes:", err);
    return res.status(500).json({
      message: "Hubo un error al eliminar los eventos recurrentes",
      error: err.message,
    });
  }
};

module.exports = {
  getByUser,
  getById,
  getByRecurrentGroupId,
  create,
  createRecurrentEvent,
  edit,
  updateStatus,
  updateRecurrentGroup,
  deleteEventoActividad,
  deletebyRecurrentGroup,
};
