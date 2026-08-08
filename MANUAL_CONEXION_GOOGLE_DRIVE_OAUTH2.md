# 🏆 MANUAL MAESTRO: Conexión de Google Drive 5TB (Personal) con Next.js & Vercel vía OAuth 2.0

Este manual documenta la **arquitectura infalible de integración** entre una cuenta personal de Google Drive (de 5 TB o cualquier capacidad) y un servidor web Serverless en **Vercel** (Next.js 14), evitando 100% las restricciones de cuota de las *Service Accounts* (`0 MB quota error`) y los errores de formato de claves RSA PKCS#8 de OpenSSL 3.0 (`ERR_OSSL_UNSUPPORTED`).

---

## 🔍 ¿Por qué usamos OAuth 2.0 en lugar de Cuentas de Servicio (*Service Accounts*)?

1. **Las Cuentas de Servicio tienen 0 MB de cuota personal**: En Google Drive personal (`@gmail.com`), los bots automatizados de servicio no pueden ser dueños de archivos sin rebotar por falta de espacio (`Service Accounts do not have storage quota`).
2. **OAuth 2.0 autoriza la cuota de tus 5 TB**: Mediante un **`Refresh Token`**, el servidor web actúa con la autoridad directa de tu usuario personal. Todo archivo subido consume de tus 5 TB sin pedir logins interactivos a los clientes de la web.

---

## 🚀 FASE 1: Configurar Google Cloud Console

1. Entra a **[console.cloud.google.com](https://console.cloud.google.com)** y crea un proyecto (ej. `Mapzy GIS`).
2. **Habilitar la API de Google Drive**:
   - Ve a **APIs y servicios** > **Biblioteca**.
   - Busca **Google Drive API** y haz clic en **HABILITAR (ENABLE)**.
3. **Pantalla de Consentimiento de OAuth**:
   - Ve a **APIs y servicios** > **Pantalla de consentimiento de OAuth**.
   - Tipo de usuario: **Usuarios externos**.
   - Completa el nombre de la app (`Mapzy Drive`) y tu correo de soporte.
   - En **Usuarios de prueba (Test users)**, agrega tu correo personal (`srfajardos@gmail.com`).
4. **Crear Credenciales OAuth 2.0**:
   - Ve a **APIs y servicios** > **Credenciales**.
   - Haz clic en **`+ CREAR CREDENCIALES`** > **ID de cliente de OAuth**.
   - Tipo de aplicación: **Aplicación web**.
   - Nombre: `Mapzy Web Drive`.
   - **URIs de redireccionamiento autorizados**: Pega exactamente:
     `https://developers.google.com/oauthplayground`
   - Haz clic en **CREAR**.
   - Haz clic en **DESCARGAR JSON** para guardar el archivo con tu `client_id` y `client_secret` 100% limpios sin distorsión de texto.

---

## 🔐 FASE 2: Obtener el `Refresh Token` en 60 Segundos

1. Abre **[https://developers.google.com/oauthplayground](https://developers.google.com/oauthplayground)**.
2. Haz clic en el **engranaje (⚙️)** arriba a la derecha.
3. Marca la casilla **`Use your own OAuth credentials`**.
4. Pega tu **OAuth Client ID** y tu **OAuth Client Secret** (extraídos de tu JSON descargado).
5. En el panel izquierdo (**Step 1**), busca **Drive API v3** y marca:
   - `https://www.googleapis.com/auth/drive`
6. Haz clic en el botón azul **`Authorize APIs`**.
7. Inicia sesión con tu correo personal (`srfajardos@gmail.com`). En la pantalla de aviso de Google, haz clic en **Avanzado / Continuar**.
8. Al regresar a OAuth Playground (**Step 2**), haz clic en el botón azul **`Exchange authorization code for tokens`**.
9. Copia el código que aparece en la casilla **`Refresh token`** (`1//04...`).

---

## 📦 FASE 3: Variables de Entorno en Vercel & Local (`.env.local`)

Agrega estas 4 variables en el panel de **Vercel** (`Settings > Environment Variables`) y en tu archivo `.env.local`:

```env
# ID de la carpeta destino de tu Google Drive Personal de 5 TB
GOOGLE_DRIVE_FOLDER_ID="YOUR_GOOGLE_DRIVE_FOLDER_ID"

# Credenciales de Autenticación OAuth 2.0
GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"
GOOGLE_REFRESH_TOKEN="YOUR_GOOGLE_REFRESH_TOKEN"
```

---

## 💻 FASE 4: El Código Backend Serverless en Next.js (`route.ts`)

En tu endpoint (`src/app/api/contacto/route.ts`), la instanciación de Google Drive se realiza mediante la clase `google.auth.OAuth2`:

```typescript
import { google } from 'googleapis';
import { Readable } from 'stream';

function getDriveService() {
  const clientId = (process.env.GOOGLE_CLIENT_ID || '').trim();
  const clientSecret = (process.env.GOOGLE_CLIENT_SECRET || '').trim();
  const refreshToken = (process.env.GOOGLE_REFRESH_TOKEN || '').trim();

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    'https://developers.google.com/oauthplayground'
  );

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  return google.drive({ version: 'v3', auth: oauth2Client });
}

// Dentro del método POST:
const drive = getDriveService();
const buffer = Buffer.from(await file.arrayBuffer());
const stream = new Readable();
stream.push(buffer);
stream.push(null);

const driveResponse = await drive.files.create({
  requestBody: {
    name: `${Date.now()}_${file.name}`,
    parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
  },
  media: {
    mimeType: file.type || 'application/octet-stream',
    body: stream,
  },
  fields: 'id, webViewLink, webContentLink',
});
```

---

## 🎯 Resultado Final

- ✅ Cero limitaciones de espacio (utiliza tus **5 Terabytes** de Google Drive).
- ✅ Cero errores de encriptación RSA u OpenSSL 3.0 en Vercel.
- ✅ Cero necesidad de loguear al cliente que visita tu web.
- ✅ El enlace del mapa subido se genera en tiempo real y se envía formateado en HTML mediante **Resend API**.
