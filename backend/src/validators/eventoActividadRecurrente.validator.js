const Joi = require("joi");

const eventoActividadRecurrenteSchema = Joi.object({
  actividad_id: Joi.number().integer().positive().required().messages({
    "any.required": "El campo 'actividad_id' es obligatorio.",
    "number.base": "El campo 'actividad_id' debe ser un número.",
    "number.integer": "El campo 'actividad_id' debe ser un número entero.",
    "number.positive": "El campo 'actividad_id' debe ser un número positivo.",
  }),
  persona_mayor_id: Joi.number().integer().positive().required().messages({
    "any.required": "El campo 'persona_mayor_id' es obligatorio.",
    "number.base": "El campo 'persona_mayor_id' debe ser un número.",
    "number.integer": "El campo 'persona_mayor_id' debe ser un número entero.",
    "number.positive": "El campo 'persona_mayor_id' debe ser un número positivo.",
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
  intervalo_horas: Joi.number().integer().positive().required().messages({
    "any.required": "El campo 'intervalo_horas' es obligatorio.",
    "number.base": "El campo 'intervalo_horas' debe ser un número.",
    "number.integer": "El campo 'intervalo_horas' debe ser un número entero.",
    "number.positive": "El campo 'intervalo_horas' debe ser un número positivo.",
  }),
  repeticiones: Joi.number().integer().positive().required().messages({
    "any.required": "El campo 'repeticiones' es obligatorio.",
    "number.base": "El campo 'repeticiones' debe ser un número.",
    "number.integer": "El campo 'repeticiones' debe ser un número entero.",
    "number.positive": "El campo 'repeticiones' debe ser un número positivo.",
  }),
});

module.exports = { eventoActividadRecurrenteSchema };