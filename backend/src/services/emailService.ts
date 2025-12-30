import nodemailer from 'nodemailer';

// Configuración del transporte (Gmail ejemplo)
// El usuario deberá configurar EMAIL_USER y EMAIL_PASS en su .env
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendProjectCompletionEmail = async (
    to: string,
    clientName: string,
    projectName: string,
    links: { label?: string; url: string }[]
) => {

    // Construir lista HTML de links
    const linksHtml = links.map(link =>
        `<li><strong>${link.label || 'Link'}:</strong> <a href="${link.url}">${link.url}</a></li>`
    ).join('');

    const mailOptions = {
        from: `"Visual Creativa CRM" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: `✅ Entrega Final: ${projectName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #333;">Hola ${clientName},</h2>
                <p>Nos complace informarte que el proyecto <strong>"${projectName}"</strong> ha sido finalizado exitosamente.</p>
                
                <h3 style="color: #007bff;">🔗 Tus enlaces de descarga:</h3>
                <ul>
                    ${linksHtml || '<li>No hay links adjuntos.</li>'}
                </ul>

                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                
                <p style="color: #666; font-size: 14px;">
                    Si tienes alguna pregunta o necesitas ajustes, no dudes en responder a este correo.
                    <br><br>
                    Saludos cordiales,<br>
                    <strong>El Equipo de Visual Creativa</strong>
                </p>
            </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Correo enviado: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error enviando correo:', error);
        throw error;
    }
};
