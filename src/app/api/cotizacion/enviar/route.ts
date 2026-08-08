import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      numCotizacion,
      cliente,
      nitCliente,
      contacto,
      ubicacion,
      nombreProyecto,
      hectareas,
      servicioNombre,
      servicioDescripcion,
      entregables,
      precioFinalFormatted,
      emailCliente,
      pdfBase64,
      filename,
    } = body;

    if (!emailCliente || typeof emailCliente !== 'string') {
      return NextResponse.json(
        { error: 'Debe ingresar un correo electrónico de destino válido.' },
        { status: 400 }
      );
    }

    // Soporte para múltiples correos separados por coma, punto y coma o espacio
    const recipientList = emailCliente
      .split(/[\s,;]+/)
      .map(e => e.trim())
      .filter(e => e.includes('@') && e.includes('.'));

    if (recipientList.length === 0) {
      return NextResponse.json(
        { error: 'No se encontraron correos válidos en el campo ingresado.' },
        { status: 400 }
      );
    }

    const cleanFilename = filename || `Propuesta_Comercial_Mapzy_${numCotizacion || 'MPZ-2026-001'}.pdf`;
    const subject = `Propuesta Comercial ${numCotizacion || 'MPZ-2026-001'}: ${nombreProyecto || 'Servicios Geoespaciales'} — Mapzy S.A.S.`;

    // Extracción infalible de Base64 puro dividiendo por la coma de Data URI
    let cleanBase64 = '';
    if (pdfBase64 && typeof pdfBase64 === 'string' && pdfBase64.length > 50) {
      cleanBase64 = pdfBase64.includes(',') ? pdfBase64.split(',')[1] : pdfBase64;
      cleanBase64 = cleanBase64.trim();
    }

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>${subject}</title>
    </head>
    <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px;">
      <div style="max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
        
        <!-- Header Corporativo Mapzy -->
        <div style="background-color: #1a2a44; color: #ffffff; padding: 28px; border-bottom: 4px solid #facc15;">
          <table width="100%" cell-padding="0" cell-spacing="0" style="border-collapse: collapse;">
            <tr>
              <td>
                <h1 style="margin: 0; font-size: 26px; color: #facc15; font-weight: 900;">Mapzy S.A.S.</h1>
                <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 11px; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">
                  INTELIGENCIA GEOESPACIAL &amp; INGENIERÍA TERRITORIAL
                </p>
              </td>
              <td style="text-align: right; vertical-align: top;">
                <span style="background: rgba(250, 204, 21, 0.2); border: 1px solid #facc15; color: #facc15; padding: 4px 10px; border-radius: 12px; font-size: 10px; font-weight: bold;">
                  ${numCotizacion || 'MPZ-2026-001'}
                </span>
              </td>
            </tr>
          </table>
        </div>

        <!-- Mensaje de Introducción -->
        <div style="padding: 28px;">
          <p style="font-size: 14px; color: #334155; margin-top: 0;">
            Estimado(a) <strong>${contacto || cliente || 'Cliente'}</strong>,
          </p>
          <p style="font-size: 13.5px; color: #334155; line-height: 1.6;">
            Es un gusto saludarle. A continuación presentamos la propuesta comercial formal <strong>N° ${numCotizacion}</strong> para la ejecución del proyecto <strong>${nombreProyecto || 'Servicios Geoespaciales'}</strong> en la ubicación <strong>${ubicacion || 'Colombia'}</strong>.
          </p>

          ${cleanBase64 ? `
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; padding: 12px 16px; border-radius: 10px; font-size: 12.5px; font-weight: bold; margin: 16px 0;">
            📎 Adjunto a este correo encontrará el archivo PDF oficial: <em>${cleanFilename}</em>
          </div>
          ` : ''}

          <!-- Tabla de Resumen de Proyecto -->
          <table width="100%" style="border-collapse: collapse; margin: 20px 0; font-size: 13px; background-color: #f8fafc; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
            <tr>
              <td style="padding: 10px 14px; font-weight: bold; color: #1a2a44; border-bottom: 1px solid #e2e8f0; width: 120px;">Cliente:</td>
              <td style="padding: 10px 14px; color: #334155; border-bottom: 1px solid #e2e8f0;">${cliente || 'Cliente'} ${nitCliente ? `(NIT: ${nitCliente})` : ''}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; font-weight: bold; color: #1a2a44; border-bottom: 1px solid #e2e8f0;">Servicio:</td>
              <td style="padding: 10px 14px; color: #334155; border-bottom: 1px solid #e2e8f0;"><strong>${servicioNombre}</strong> (${hectareas} Hectáreas)</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; font-weight: bold; color: #1a2a44;">Ubicación:</td>
              <td style="padding: 10px 14px; color: #334155;">${ubicacion || 'Colombia'}</td>
            </tr>
          </table>

          <!-- Cuadro Destacado de Inversión Total -->
          <div style="background-color: #1a2a44; color: #ffffff; padding: 20px; border-radius: 12px; text-align: center; margin: 24px 0;">
            <span style="font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: bold; letter-spacing: 1px; display: block; margin-bottom: 4px;">
              INVERSIÓN TOTAL FINAL ESTIMADA
            </span>
            <span style="font-size: 28px; font-weight: 900; color: #facc15; display: block;">
              ${precioFinalFormatted}
            </span>
            <span style="font-size: 11px; color: #cbd5e1; display: block; margin-top: 4px;">
              Régimen Especial — Incluye Procesamiento &amp; Almacenamiento 5TB
            </span>
          </div>

          <!-- Entregables Incluidos -->
          <h3 style="font-size: 14px; color: #1a2a44; border-left: 4px solid #facc15; padding-left: 10px; margin-top: 24px; text-transform: uppercase; letter-spacing: 0.5px;">
            Entregables Formales del Proyecto
          </h3>
          <ul style="font-size: 12.5px; color: #334155; line-height: 1.8; padding-left: 20px;">
            ${(entregables || []).map((item: string) => `<li>${item}</li>`).join('')}
          </ul>

          <p style="font-size: 12px; color: #64748b; margin-top: 20px; line-height: 1.5; background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #f1f5f9;">
            • <strong>Forma de Pago:</strong> 50% de anticipo al firmar acta de inicio y 50% contra entrega.<br>
            • <strong>Nube Corporativa:</strong> Los archivos finales se cargarán en la nube de Google Drive de Mapzy (5TB) con enlace de descarga directa.
          </p>

          <br>
          <p style="font-size: 13px; color: #334155;">Quedamos atentos a sus comentarios para iniciar la programación operativa.</p>
          <br>

          <!-- FIRMA OFICIAL DE SERGIO RICARDO FAJARDO SÁNCHEZ -->
          <table cell-padding="0" cell-spacing="0" style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 13px; color: #334155; line-height: 1.4; border-collapse: collapse; margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
            <tr>
              <td style="padding-right: 16px; vertical-align: middle; text-align: center;">
                <div style="width: 48px; height: 48px; background-color: #facc15; border-radius: 50%; text-align: center; line-height: 48px; font-weight: 900; color: #1a2a44; font-size: 18px;">
                  M
                </div>
                <span style="font-family: Arial, sans-serif; font-size: 16px; font-weight: 900; color: #1a2a44; display: block; margin-top: 4px;">Mapzy</span>
              </td>
              <td style="border-left: 3px solid #facc15; padding-left: 16px; vertical-align: middle;">
                <div style="font-size: 14px; font-weight: 800; color: #1a2a44; text-transform: uppercase;">
                  SERGIO RICARDO FAJARDO SÁNCHEZ
                </div>
                <div style="font-size: 11.5px; font-weight: 700; color: #0284c7; margin-top: 2px;">
                  Ingeniero Geólogo &nbsp;|&nbsp; Especialista en Gestión Ambiental
                </div>
                <div style="font-size: 11px; color: #64748b; font-weight: 600; margin-top: 1px; margin-bottom: 6px;">
                  Consultor Técnico en Territorio, Ordenamiento y Gestión del Riesgo
                </div>
                <div style="font-size: 11.5px; color: #334155; border-top: 1px solid #e2e8f0; padding-top: 6px;">
                  <strong style="color: #1a2a44;">📱 Móvil:</strong> +57 320 259 9940 &nbsp;&nbsp;|&nbsp;&nbsp; 
                  <strong style="color: #1a2a44;">✉️ Correo:</strong> <a href="mailto:contacto@mapzy.com.co" style="color: #0284c7; text-decoration: none; font-weight: 600;">contacto@mapzy.com.co</a>
                </div>
                <div style="font-size: 11.5px; color: #334155; margin-top: 3px;">
                  <strong style="color: #1a2a44;">🌐 Web:</strong> <a href="https://mapzy.com.co" style="color: #0284c7; text-decoration: none; font-weight: 700;">mapzy.com.co</a> &nbsp;&nbsp;|&nbsp;&nbsp;
                  <span style="color: #64748b; font-size: 10px; font-weight: 700;">MAPAS, ZONIFICACIÓN Y YACIMIENTOS</span>
                </div>
              </td>
            </tr>
          </table>

        </div>

        <!-- Footer Email -->
        <div style="background-color: #f8fafc; padding: 16px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #f1f5f9;">
          <strong>Mapzy S.A.S.</strong> — NIT: 901.845.123-4 | contacto@mapzy.com.co | www.mapzy.com.co<br>
          Bogotá D.C. — Colombia
        </div>
      </div>
    </body>
    </html>
    `;

    // Convertir el string Base64 limpio a un Buffer binario real para Resend
    const attachments = cleanBase64
      ? [
          {
            filename: cleanFilename,
            content: Buffer.from(cleanBase64, 'base64'),
          },
        ]
      : [];

    const data = await resend.emails.send({
      from: 'Mapzy S.A.S. <contacto@mapzy.com.co>',
      to: recipientList,
      bcc: ['srfajardos@gmail.com'],
      replyTo: 'contacto@mapzy.com.co',
      subject: subject,
      html: htmlContent,
      attachments,
    });

    return NextResponse.json({
      success: true,
      recipientsCount: recipientList.length,
      recipients: recipientList,
      hasAttachment: attachments.length > 0,
      attachmentBytes: cleanBase64.length,
      data
    });
  } catch (error: unknown) {
    console.error('Error al enviar cotización por correo:', error);
    const msg = error instanceof Error ? error.message : 'Error desconocido enviando correo';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
