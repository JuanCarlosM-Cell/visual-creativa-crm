import sgMail from '@sendgrid/mail';

// Configurar SendGrid con API Key
if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export const sendProjectCompletionEmail = async (
    to: string,
    clientName: string,
    projectName: string,
    links: { label?: string; url: string }[]
) => {
    // Verificar que SendGrid esté configurado
    if (!process.env.SENDGRID_API_KEY) {
        console.warn('⚠️ SENDGRID_API_KEY no configurado. No se puede enviar email.');
        throw new Error('SendGrid no está configurado');
    }

    if (!process.env.EMAIL_USER) {
        console.warn('⚠️ EMAIL_USER no configurado.');
        throw new Error('EMAIL_USER no está configurado');
    }

    // Construir lista HTML de links
    const linksHtml = links.map(link =>
        `<li><strong>${link.label || 'Link'}:</strong> <a href="${link.url}">${link.url}</a></li>`
    ).join('');

    const msg = {
        to: to,
        from: process.env.EMAIL_USER, // Debe ser el email verificado en SendGrid
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
        `,
    };

    try {
        const response = await sgMail.send(msg);
        console.log('✅ Correo enviado exitosamente via SendGrid API');
        console.log('Response status:', response[0].statusCode);
        return response;
    } catch (error: any) {
        console.error('❌ Error enviando correo via SendGrid:', error);
        if (error.response) {
            console.error('SendGrid error body:', error.response.body);
        }
        throw error;
    }
};
