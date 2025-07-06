const dayjs = require("dayjs");
const enviarCorreo = require("./mailer");


const programarRecordatorio = ({ correoDestino, nombreUsuario, actividad, personaMayor, fecha_inicio }) => {
    const fechaEvento = dayjs(fecha_inicio);
    const fechaEnvio = fechaEvento.subtract(1, "day");
    const ahora = dayjs();

    console.log("fechaEvento:", fechaEvento);
    console.log("fechaEnvio:", fechaEnvio);
    console.log("ahora:", ahora);

    const delay = fechaEnvio.diff(ahora, "millisecond");

    if (delay <= 0) {
        console.log("⏰ La fecha para enviar recordatorio ya pasó. No se programará.");
        return;
    }

    console.log(`✅ Recordatorio programado para ${fechaEnvio.format("YYYY-MM-DD HH:mm")} al correo ${correoDestino}`);

    setTimeout(async () => {
        await enviarCorreo(
            correoDestino,
            "Recordatorio anticipado: actividad programada",
            `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
        <h2 style="color: #2c3e50;">Hola ${nombreUsuario},</h2>
        <p>Este es un recordatorio automático de la actividad programada para <strong>${personaMayor.nombre} ${personaMayor.apellido || ''}</strong>.</p>

        <ul style="font-size: 15px; line-height: 1.5;">
          <li><strong>Actividad:</strong> ${actividad.nombre}</li>
          <li><strong>Descripción:</strong> ${actividad.descripcion}</li>
          <li><strong>Fecha y hora de inicio:</strong> ${fecha_inicio}</li>
        </ul>

        <p>Este recordatorio ha sido enviado 1 día antes como solicitaste.</p>
        <p style="font-size: 13px; color: #888;">Mensaje generado por Geriacare</p>
      </div>
      `
        );
    }, delay);
};

module.exports = {
    programarRecordatorio
};