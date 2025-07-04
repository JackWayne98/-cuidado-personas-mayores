const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.CORREO_GMAIL,
        pass: process.env.CLAVE_GMAIL
    }
});

const enviarCorreo = async (para, asunto, htmlContenido) => {
    const mailOptions = {
        from: `"Geriacare Notificaciones" <${process.env.CORREO_GMAIL}>`,
        to: para,
        subject: asunto,
        html: htmlContenido
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`📧 Correo enviado a ${para}`);
    } catch (error) {
        console.error('❌ Error al enviar correo:', error);
    }
};

module.exports = enviarCorreo;