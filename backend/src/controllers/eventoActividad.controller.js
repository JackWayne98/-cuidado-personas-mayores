const EventoActividad = require("../models/eventoActividad.model.js");
const dayjs = require("dayjs");
const { v4: uuidv4 } = require("uuid");

const {
  eventoActividadSchema,
} = require("../validators/eventoActividad.validator.js");
const { eventoActividadRecurrenteSchema } = require("../validators/eventoActividadRecurrente.validator.js");

const getByUser = async (req, res) => {
  try {
    const events = await EventoActividad.selectByUser(req.user.id);
    res.json({
      message: "Eventos obtenidos correctamente",
      events,
    });
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    res.status(500).json({
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
  res.json({
    message: "Evento obtenido Correctamente",
    eventoActividad,
  });
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
    const { actividad_id, fecha_inicio, fecha_fin, recordatorio } = value;

    const perfil_usuario_id = req.user.id;
    const creado_por = req.user.id;
    const modificado_por = creado_por;
    const fecha_creacion = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const fecha_modificacion = fecha_creacion;
    const estado = "pendiente";

    const result = await EventoActividad.insertEventoActividad(
      actividad_id,
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

    res.status(201).json({
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
    console.log("Insertando evento con grupo_recurrencia_id:", grupo_recurrencia_id);
      inicio = inicio.add(intervalo_horas, "hour");
      fin = fin.add(intervalo_horas, "hour");
    }
    const eventos = await Promise.all(inserts);

    res.status(201).json({
       message: "Eventos recurrentes registrados correctamente",
      grupo_recurrencia_id,
      eventos
    });
  } catch (err) {
    console.error("Error al registrar eventos recurrentes:", err);
    res.status(500).json({
      message: "Hubo un error en el registro de eventos recurrentes",
      error: err.message,
    });
  }
};

module.exports = { getByUser, getById, create, createRecurrentEvent };
