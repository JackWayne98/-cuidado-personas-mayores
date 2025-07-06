const db = require("../config/db.js");

const checkPersonaMayorAccess = (options = {}) => {
  return async (req, res, next) => {
    try {
      const perfilUsuarioId = req.user.id;
      let personaMayorId = null;

      if (options.fromPersonaMayorId) {
        personaMayorId =
          req.params.elderId ||
          req.params.persona_mayor_id ||
          req.body.persona_mayor_id;

      } else if (options.fromEventoActividad) {
        const eventoActividadId = req.params.id || req.body.evento_actividad_id;
        if (!eventoActividadId) {
          return res.status(400).json({
            message: "El ID del evento actividad es requerido.",
          });
        }

        const [rows] = await db.query(
          `SELECT persona_mayor_id 
           FROM evento_actividad
           WHERE id = ? LIMIT 1`,
          [eventoActividadId]
        );

        if (rows.length === 0) {
          return res.status(404).json({
            message: "Evento actividad no encontrado.",
          });
        }

        personaMayorId = rows[0].persona_mayor_id;

      } else if (options.fromRecurrentGroup) {
        const groupId = req.params.grupo_recurrencia_id;
        if (!groupId) {
          return res.status(400).json({
            message: "El ID del grupo de recurrencia es requerido.",
          });
        }

        const [rows] = await db.query(
          `SELECT persona_mayor_id 
           FROM evento_actividad
           WHERE grupo_recurrencia_id = ? LIMIT 1`,
          [groupId]
        );

        if (rows.length === 0) {
          return res.status(404).json({
            message: "Grupo de recurrencia no encontrado o sin eventos asociados.",
          });
        }

        personaMayorId = rows[0].persona_mayor_id;
      }

      if (!personaMayorId) {
        return res.status(400).json({
          message: "No se pudo determinar el ID de la persona mayor.",
        });
      }

      const [existsRows] = await db.query(
        `SELECT 1 FROM persona_mayor WHERE id = ? LIMIT 1`,
        [personaMayorId]
      );

      if (existsRows.length === 0) {
        return res.status(404).json({
          message: "La persona mayor no existe.",
        });
      }

      const [validRows] = await db.query(
        `SELECT 1 FROM persona_usuario
         WHERE persona_mayor_id = ? AND perfil_usuario_id = ? LIMIT 1`,
        [personaMayorId, perfilUsuarioId]
      );

      if (validRows.length === 0) {
        return res.status(403).json({
          message:
            "No tienes permisos para acceder a esta persona mayor o sus datos.",
        });
      }

      next();

    } catch (error) {
      console.error("Error en checkPersonaMayorAccess middleware:", error);
      return res.status(500).json({
        message: "Error del servidor al validar acceso.",
        error: error.message,
      });
    }
  };
};

module.exports = checkPersonaMayorAccess;