import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { google } from 'googleapis';
import { Readable } from 'stream';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

// Normalizador nativo OpenSSL 3.0 usando crypto.createPrivateKey
function parsePrivateKeySafely(rawKey: string): string {
  if (!rawKey) return '';
  let key = rawKey.trim();

  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.substring(1, key.length - 1);
  }

  key = key.replace(/\\\\n/g, '\n').replace(/\\n/g, '\n').replace(/\r\n/g, '\n');

  try {
    const keyObj = crypto.createPrivateKey({
      key,
      format: 'pem',
    });
    return keyObj.export({ type: 'pkcs8', format: 'pem' }).toString();
  } catch (err) {
    console.error('⚠️ Aviso: crypto.createPrivateKey fallo, usando formato respaldado:', err);
    return key;
  }
}

// Desempacador universal de credenciales Google Service Account
function getGoogleCredentials() {
  const defaultEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '';
  let rawKey = (process.env.GOOGLE_PRIVATE_KEY || '').trim();

  if ((rawKey.startsWith('"') && rawKey.endsWith('"')) || (rawKey.startsWith("'") && rawKey.endsWith("'"))) {
    rawKey = rawKey.substring(1, rawKey.length - 1);
  }

  // Si viene en Base64 (JSON completo o key en base64)
  if (!rawKey.includes('-----BEGIN') && rawKey.length > 50) {
    try {
      const decodedText = Buffer.from(rawKey, 'base64').toString('utf-8');
      
      if (decodedText.includes('{') && decodedText.includes('private_key')) {
        const jsonObj = JSON.parse(decodedText);
        const parsedEmail = jsonObj.client_email || defaultEmail;
        const normalizedKey = parsePrivateKeySafely(jsonObj.private_key || '');
        console.log('✅ Credenciales de Google decodificadas desde JSON Base64.');
        return { client_email: parsedEmail, private_key: normalizedKey };
      }

      if (decodedText.includes('-----BEGIN')) {
        console.log('✅ Llave PEM decodificada desde Base64.');
        return { client_email: defaultEmail, private_key: parsePrivateKeySafely(decodedText) };
      }
    } catch (err) {
      console.warn('Aviso: Fallo decodificación Base64:', err);
    }
  }

  return { client_email: defaultEmail, private_key: parsePrivateKeySafely(rawKey) };
}

// Configuración de Google Drive Auth
function getDriveService() {
  const credentials = getGoogleCredentials();

  console.log('📌 Autenticando Google Drive - Email:', credentials.client_email, '| Key len:', credentials.private_key.length);

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive'],
  });

  return google.drive({ version: 'v3', auth });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const nombre = formData.get('Nombre')?.toString() || 'Sin nombre';
    const empresa = formData.get('Empresa')?.toString() || 'No especificada';
    const email = formData.get('Email')?.toString() || 'sin-email@mapzy.com.co';
    const telefono = formData.get('Teléfono')?.toString() || 'No especificado';
    const tipodeSolicitud = formData.get('Tipo de Solicitud')?.toString() || 'Consulta General';
    const servicioRequerido = formData.get('Servicio Requerido')?.toString() || 'General';
    const area = formData.get('Área Estimada')?.toString() || 'N/A';
    const presupuesto = formData.get('Presupuesto Estimado')?.toString() || 'N/A';
    const descripcion = formData.get('Descripción Técnica')?.toString() || formData.get('Mensaje de Consulta')?.toString() || 'Sin descripción';
    const turnstileToken = formData.get('cf-turnstile-response')?.toString();

    // Sanitizar Secret Key de Turnstile (eliminar espacios y comillas)
    const turnstileSecret = (process.env.TURNSTILE_SECRET_KEY || '').trim().replace(/^["']|["']$/g, '');

    // 1. Validar Captcha Turnstile de Cloudflare si existe token y secret
    if (turnstileToken && turnstileSecret) {
      try {
        const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            secret: turnstileSecret,
            response: turnstileToken,
          }),
        });

        const turnstileData = await turnstileRes.json();
        if (!turnstileData.success) {
          console.warn('Turnstile respondió avisos (no bloqueante):', turnstileData);
        }
      } catch (tErr) {
        console.warn('Excepción en verificación Turnstile (no bloqueante):', tErr);
      }
    }

    // 2. Procesar Archivo GIS si viene adjunto y subirlo a Google Drive
    let driveFileUrl = '';
    let driveFileName = '';
    const file = formData.get('Archivo Adjunto') as File | null;

    if (file && file.size > 0) {
      console.log('📌 Archivo adjunto detectado:', file.name, 'Tamaño:', file.size, 'bytes');
      
      if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && !process.env.GOOGLE_PRIVATE_KEY) {
        console.error('❌ Faltan credenciales de Google Service Account en Vercel.');
      } else {
        try {
          const drive = getDriveService();
          const buffer = Buffer.from(await file.arrayBuffer());
          const stream = new Readable();
          stream.push(buffer);
          stream.push(null);

          const folderId = (process.env.GOOGLE_DRIVE_FOLDER_ID || '').trim().replace(/^["']|["']$/g, '');
          console.log('📌 Subiendo archivo a Google Drive Folder ID:', folderId);

          const driveResponse = await drive.files.create({
            requestBody: {
              name: `${Date.now()}_${file.name}`,
              parents: folderId ? [folderId] : undefined,
            },
            media: {
              mimeType: file.type || 'application/octet-stream',
              body: stream,
            },
            supportsAllDrives: true,
            fields: 'id, webViewLink, webContentLink',
          });

          driveFileUrl = driveResponse.data.webViewLink || driveResponse.data.webContentLink || '';
          driveFileName = file.name;
          console.log('✅ Archivo subido con éxito a Google Drive:', driveFileUrl);

          // Otorgar permisos de lectura pública si el archivo fue creado
          if (driveResponse.data.id) {
            await drive.permissions.create({
              fileId: driveResponse.data.id,
              supportsAllDrives: true,
              requestBody: {
                role: 'reader',
                type: 'anyone',
              },
            });
          }
        } catch (driveErr) {
          console.error('❌ Error subiendo archivo a Google Drive:', driveErr);
        }
      }
    } else {
      console.log('ℹ️ Solicitud sin archivo físico adjunto.');
    }

    // 3. Enviar correo formateado mediante Resend API
    const emailSubject = `[Mapzy Web] Nueva Solicitud: ${tipodeSolicitud} - ${nombre}`;
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0;">
        <div style="background-color: #1a2a44; padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
          <h1 style="color: #facc15; margin: 0; font-size: 24px;">Mapzy S.A.S.</h1>
          <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 12px; font-weight: bold; text-transform: uppercase;">Notificación de Contacto Web</p>
        </div>

        <div style="background-color: #ffffff; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0;">
          <h2 style="color: #1a2a44; font-size: 18px; margin-top: 0;">Detalles del Remitente</h2>
          <table style="width: 100%; font-size: 14px; color: #334155; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold; width: 140px;">Nombre:</td><td>${nombre}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Empresa:</td><td>${empresa}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Correo:</td><td><a href="mailto:${email}" style="color: #2563eb;">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Teléfono / WA:</td><td>${telefono}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Tipo de Solicitud:</td><td><span style="background-color: #fef08a; color: #854d0e; padding: 2px 8px; border-radius: 6px; font-weight: bold; font-size: 12px;">${tipodeSolicitud}</span></td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Servicio:</td><td>${servicioRequerido}</td></tr>
            ${area !== 'N/A' ? `<tr><td style="padding: 8px 0; font-weight: bold;">Área Estimada:</td><td>${area}</td></tr>` : ''}
            ${presupuesto !== 'N/A' ? `<tr><td style="padding: 8px 0; font-weight: bold;">Presupuesto:</td><td>${presupuesto}</td></tr>` : ''}
          </table>

          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />

          <h3 style="color: #1a2a44; font-size: 16px; margin-bottom: 8px;">Requerimiento / Consulta:</h3>
          <div style="background-color: #f1f5f9; padding: 16px; border-radius: 8px; font-size: 14px; color: #1e293b; white-space: pre-wrap;">${descripcion}</div>

          ${driveFileUrl ? `
            <div style="margin-top: 24px; padding: 16px; background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px;">
              <p style="margin: 0 0 8px 0; font-weight: bold; color: #1e40af; font-size: 14px;">📁 Archivo Cartográfico Adjunto (Google Drive):</p>
              <p style="margin: 0 0 12px 0; font-size: 13px; color: #1d4ed8;">${driveFileName}</p>
              <a href="${driveFileUrl}" target="_blank" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-weight: bold; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 13px;">Ver y Descargar Archivo en Google Drive</a>
            </div>
          ` : ''}
        </div>

        <div style="text-align: center; margin-top: 24px; font-size: 12px; color: #94a3b8;">
          <p>Este correo fue generado automáticamente desde la plataforma de Mapzy.</p>
        </div>
      </div>
    `;

    const { data: resendData, error: resendError } = await resend.emails.send({
      from: 'Mapzy Web <contacto@mapzy.com.co>',
      to: ['contacto@mapzy.com.co', 'srfajardos@gmail.com'],
      replyTo: email,
      subject: emailSubject,
      html: emailHtml,
    });

    if (resendError) {
      console.error('Error de Resend:', resendError);
      return NextResponse.json({ error: resendError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: resendData });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error procesando formulario:', error);
    return NextResponse.json({ error: error?.message || 'Error interno del servidor.' }, { status: 500 });
  }
}
