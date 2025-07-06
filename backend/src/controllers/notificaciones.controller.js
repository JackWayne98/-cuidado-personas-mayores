const dayjs = require("dayjs");
const Notificacion = require("../models/notificaciones.model.js");
const db = require("../config/db.js");

const create = async (req, res) => {
  try {
    const { evento_actividad_id } = req.body;
    if (!evento_actividad_id) {
      return res
        .status(400)
        .json({ error: "Evento actividad ID es requerido" });
    }
    const [rows] = await db.query(
      `SELECT ea.id AS evento_actividad_id, 
                  ea.perfil_usuario_id, 
                  a.nombre AS actividad_nombre, 
                  pm.nombre AS persona_mayor_nombre, 
                  pm.apellido AS persona_mayor_apellido
           FROM evento_actividad ea
           JOIN actividad a ON ea.actividad_id = a.id
           JOIN persona_mayor pm ON a.persona_mayor_id = pm.id
           WHERE ea.id = ?
           LIMIT 1`,
      [evento_actividad_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Evento actividad no encontrado" });
    }
    const evento = rows[0];

    const mensaje = `Recordatorio: Tienes programada la actividad ${evento.actividad_nombre} para ${evento.persona_mayor_nombre} ${evento.persona_mayor_apellido}.`;
    const fecha_envio = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const leida = 0;

    try {
      const result = await Notificacion.insert(
        evento.evento_actividad_id,
        evento.perfil_usuario_id,
        mensaje,
        fecha_envio,
        leida
      );
      const notificacion = await Notificacion.selectById(result.insertId);

      return res.status(201).json({
        message: "Notificación creada exitosamente",
        notificacion,
      });
    } catch (insertErr) {
      console.error(
        "Error en Notificacion.insert:",
        insertErr.message,
        insertErr
      );
      return res.status(500).json({
        error: "Error al insertar notificación",
        detalle: insertErr.message,
      });
    }
  } catch (err) {
    console.error("Error al crear notificación:", err.message, err);
    return res
      .status(500)
      .json({ error: "Error al crear notificación", detalle: err.message });
  }
};

const getById = async (req, res) => {
    const {notificacionId} = req.params;

    const result = await Notificacion.selectById(id)
    return res.json({
        message: "Notificación obtenida exitosamente",
        result
    })
};

const markAsRead = async (req, res)=>{

    try {
        const {id} = req.params;
        const result = await Notificacion.putAsRead(id)
        if(!result.affectedRows){
            return res.status(404).json({error: "Notificación no encontrada"})
        }
        return res.json({
            message: "Notificación marcada como leída exitosamente",
            result
        });
    } catch (error) {
        console.error("Error al marcar notificación como leída:", error.message, error);
        return res.status(500).json({
            error: "Error al marcar notificación como leída",
            detalle: error.message
        });
        
    }
}

module.exports = { create, getById, markAsRead };
