import { NextResponse, type NextRequest } from 'next/server';

/**
 * Herramientas internas de Mapzy que exigen autenticación de servidor.
 * Cubre el prefijo exacto y cualquier subruta.
 */
const RUTAS_PROTEGIDAS = [
  '/herramientas/caza',
  '/herramientas/cotizador',
  '/api/caza',
  // El cotizador envia correos por Resend desde aqui: sin puerta es un relay abierto.
  '/api/cotizacion',
];

const REALM = 'Mapzy Herramientas Internas';

function estaProtegida(pathname: string): boolean {
  return RUTAS_PROTEGIDAS.some(
    (prefijo) => pathname === prefijo || pathname.startsWith(`${prefijo}/`)
  );
}

/**
 * Comparación en tiempo constante. Recorre siempre la longitud mayor para no
 * filtrar por latencia ni el contenido ni la longitud del secreto.
 */
function comparaSeguro(a: string, b: string): boolean {
  let diff = a.length ^ b.length;
  const largo = Math.max(a.length, b.length);
  for (let i = 0; i < largo; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

function pedirCredenciales(): NextResponse {
  return new NextResponse('Autenticación requerida.', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"`,
      'Cache-Control': 'no-store',
    },
  });
}

/**
 * Puerta HTTP Basic para las herramientas internas.
 * Devuelve una respuesta cuando debe cortar la petición, o null para dejarla pasar.
 */
export function verificarAccesoInterno(request: NextRequest): NextResponse | null {
  if (!estaProtegida(request.nextUrl.pathname)) return null;

  const usuarioEsperado = process.env.MAPZY_TOOLS_USER;
  const claveEsperada = process.env.MAPZY_TOOLS_PASSWORD;

  // Falla cerrado: sin credenciales configuradas la herramienta no se expone.
  if (!usuarioEsperado || !claveEsperada) {
    return new NextResponse(
      'Herramienta no disponible: faltan MAPZY_TOOLS_USER y MAPZY_TOOLS_PASSWORD.',
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const cabecera = request.headers.get('authorization');
  if (!cabecera?.startsWith('Basic ')) return pedirCredenciales();

  let usuario: string;
  let clave: string;
  try {
    const plano = atob(cabecera.slice(6).trim());
    const corte = plano.indexOf(':');
    if (corte === -1) return pedirCredenciales();
    usuario = plano.slice(0, corte);
    clave = plano.slice(corte + 1);
  } catch {
    return pedirCredenciales();
  }

  // Se evalúan ambas comparaciones siempre, sin cortocircuito.
  const usuarioOk = comparaSeguro(usuario, usuarioEsperado);
  const claveOk = comparaSeguro(clave, claveEsperada);
  if (!usuarioOk || !claveOk) return pedirCredenciales();

  return null;
}
