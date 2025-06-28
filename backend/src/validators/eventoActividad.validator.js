const Joi = require("joi");

const eventoActividadSchema = Joi.object({
  actividad_id: Joi.number().integer().positive().required().messages({
    "any.required": "El campo 'actividad_id' es obligatorio.",
    "number.base": "El campo 'actividad_id' debe ser un número.",
    "number.integer": "El campo 'actividad_id' debe ser un número entero.",
    "number.positive": "El campo 'actividad_id' debe ser un número positivo.",
  }),
  fecha_inicio: Joi.string().required().messages({
    "any.required": "El campo 'fecha_inicio' es obligatorio.",
    "string.base": "El campo 'fecha_inicio' debe ser un texto.",
  }),
  fecha_fin: Joi.string().required().messages({
    "any.required": "El campo 'fecha_fin' es obligatorio.",
    "string.base": "El campo 'fecha_fin' debe ser un texto.",
  }),
  recordatorio: Joi.boolean().optional().messages({
    "boolean.base": "El campo 'recordatorio' debe ser verdadero o falso.",
  }),
  repeticiones: Joi.number().integer().positive().optional().messages({
    "number.base": "El campo 'repeticiones' debe ser un número.",
    "number.integer": "El campo 'repeticiones' debe ser un número entero.",
    "number.positive": "El campo 'repeticiones' debe ser un número positivo.",
  }),
  intervalo_dias: Joi.number().integer().positive().optional().messages({
    "number.base": "El campo 'intervalo_dias' debe ser un número.",
    "number.integer": "El campo 'intervalo_dias' debe ser un número entero.",
    "number.positive": "El campo 'intervalo_dias' debe ser un número positivo.",
  }),
})
  .custom((value, helpers) => {
    // Si uno de los dos campos de recurrencia está presente, el otro es obligatorio
    if (
      (value.repeticiones && !value.intervalo_dias) ||
      (!value.repeticiones && value.intervalo_dias)
    ) {
      return helpers.error("any.custom", {
        message:
          "Si se incluye 'repeticiones' o 'intervalo_dias', ambos campos son obligatorios.",
      });
    }
    return value;
  })
  .messages({
    "any.custom":
      "Si se incluye 'repeticiones' o 'intervalo_dias', ambos campos son obligatorios.",
  });

module.exports = { eventoActividadSchema };