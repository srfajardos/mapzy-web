import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { verificarAccesoInterno } from '@/lib/auth/basic';

export async function middleware(request: NextRequest): Promise<NextResponse> {
  // 1) Puerta HTTP Basic de las herramientas internas.
  const bloqueo = verificarAccesoInterno(request);
  if (bloqueo) return bloqueo;

  // 2) Sesión de Supabase (no-op mientras no haya credenciales configuradas).
  return await updateSession(request);
}

export const config = {
  // Solo las rutas que realmente necesitan middleware. El sitio público
  // (inicio, servicios, blog, artículos, proyectos) no pasa por aquí.
  matcher: [
    '/herramientas/caza/:path*',
    '/api/caza/:path*',
    '/api/cotizacion/:path*',
    '/herramientas/cotizador/:path*',
    '/dashboard/:path*',
    '/login',
    '/register',
  ],
};
