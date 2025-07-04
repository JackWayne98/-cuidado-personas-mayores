const dayjs = require("dayjs");
const enviarCorreo = require("../utils/mailer");

const Contacto = require("../models/contactosEmergencia.model");
const PersonaMayor = require("../models/personasMayores.model");

const create = async (req, res) => {
    try {
        const {
            persona_mayor_id,
            nombre,
            correo,
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
            correo,
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

        const calcularEdad = (fechaNacimiento) => {
            const hoy = new Date();
            const nacimiento = new Date(fechaNacimiento);
            let edad = hoy.getFullYear() - nacimiento.getFullYear();
            const m = hoy.getMonth() - nacimiento.getMonth();
            if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
                edad--;
            }
            return edad;
        };

        const edad = calcularEdad(personaMayor.fecha_nacimiento);

        // Enviar correo al nuevo contacto
        await enviarCorreo(
            correo,
            "Ha sido registrado como contacto de emergencia",
            `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
    <h2 style="color: #2c3e50;">Hola ${nombre},</h2>
    <p style="font-size: 16px;">
      Has sido registrado como <strong>contacto de emergencia</strong> en la plataforma <strong>Geriacare</strong>.
    </p>

    <h3 style="color: #2980b9;">🧓 Información de la persona mayor</h3>
    <ul style="font-size: 15px; line-height: 1.5;">
      <li><strong>Nombre:</strong> ${personaMayor.nombre} ${personaMayor.apellido || ''}</li>
      <li><strong>Edad:</strong> ${edad} años</li>
      <li><strong>Condiciones médicas:</strong> ${personaMayor.condiciones_medicas || 'No registradas'}</li>
    </ul>

    <h3 style="color: #2980b9;">📇 Tus datos registrados</h3>
    <ul style="font-size: 15px; line-height: 1.5;">
      <li><strong>Relación:</strong> ${relacion}</li>
      <li><strong>Teléfono:</strong> ${telefono}</li>
      ${es_medico ? "<li><strong>Observación:</strong> Este contacto ha sido marcado como médico de referencia.</li>" : ""}
    </ul>

    <p style="font-size: 15px;">
      Por favor, mantente atento(a) ante cualquier notificación relacionada con esta persona.
    </p>

    <p style="font-size: 13px; color: #888; margin-top: 30px;">
      Este es un mensaje automático generado por Geriacare.
    </p>
  </div>
  `
        );

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
            correo,
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
            correo,
            telefono,
            relacion,
            es_medico,
            modificado_por,
            fecha_modificacion
        };

        await Contacto.update(id, datos);
        const contactoActualizado = await Contacto.selectById(id);

        const calcularEdad = (fechaNacimiento) => {
            const hoy = new Date();
            const nacimiento = new Date(fechaNacimiento);
            let edad = hoy.getFullYear() - nacimiento.getFullYear();
            const m = hoy.getMonth() - nacimiento.getMonth();
            if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
                edad--;
            }
            return edad;
        };

        // Enviar correo al nuevo contacto

        const personaMayor = await PersonaMayor.selectById(contacto.persona_mayor_id);
        const edad = calcularEdad(personaMayor.fecha_nacimiento);

        await enviarCorreo(
            contactoActualizado.correo,
            "Tu información como contacto de emergencia ha sido actualizada",
            `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
    <h2 style="color: #2c3e50;">Hola ${contacto.nombre},</h2>
    <p style="font-size: 16px;">
      Tu información como <strong>contacto de emergencia</strong> ha sido actualizada en la plataforma <strong>Geriacare</strong>.
    </p>

    <h3 style="color: #2980b9;">📇 Datos actuales registrados</h3>
    <ul style="font-size: 15px; line-height: 1.5;">
      <li><strong>Relación:</strong> ${contacto.relacion}</li>
      <li><strong>Teléfono:</strong> ${contacto.telefono}</li>
      ${contacto.es_medico ? "<li><strong>Observación:</strong> Este contacto ha sido marcado como médico de referencia.</li>" : ""}
    </ul>

    <h3 style="color: #2980b9;">🧓 Persona mayor asociada</h3>
    <ul style="font-size: 15px; line-height: 1.5;">
      <li><strong>Nombre:</strong> ${personaMayor.nombre} ${personaMayor.apellido || ''}</li>
      <li><strong>Edad:</strong> ${edad} años</li>
      <li><strong>Condiciones médicas:</strong> ${personaMayor.condiciones_medicas || 'No registradas'}</li>
    </ul>

    <p style="font-size: 15px;">
      Si tú no solicitaste esta modificación, por favor comunícate con el responsable de la cuenta.
    </p>

    <p style="font-size: 13px; color: #888; margin-top: 30px;">
      Este es un mensaje automático generado por Geriacare.
    </p>
  </div>
  `
        );

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