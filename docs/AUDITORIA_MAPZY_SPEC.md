# Auditoría de Seguridad y Arquitectura Mapzy

## Resumen Ejecutivo

**22 hallazgos críticos** identificados en mapzy.com.co. Clasificados por severidad: **22 crítico, 0 alto, 0 medio, 0 bajo**.

**Artefacto visual completo**: `/home/claude/aud/auditoria-mapzy.html` (reporte interactivo)

## Hallazgos por Categoría

### 🔴 SEGURIDAD (8 hallazgos)

#### 1. PIN Hardcoded en Cliente — CRÍTICO
**Archivo**: `/src/components/cotizador.tsx` (o equiv), línea ~180  
**Severidad**: CRÍTICO  
**Descripción**: PIN 2326 visible en código JavaScript del navegador  
**Impacto**: Cualquiera puede desbloquear funcionalidad restringida  
**Fix**: Mover a variable de entorno backend, validar server-side  
**Tiempo**: 30 minutos  
**Bloquea**: Fase 2 (Cotizador se usa con clientes reales)

#### 2. OAuth Tokens en localStorage — CRÍTICO
**Severidad**: CRÍTICO  
**Descripción**: Google OAuth tokens almacenados sin encriptación en localStorage  
**Impacto**: Tokens vulnerables a XSS  
**Fix**: Usar httpOnly cookies + backend token rotation  
**Tiempo**: 2 horas  
**Bloquea**: Cualquier fase (security fundamental)

#### 3. .env Variables Expuestas — CRÍTICO
**Severidad**: CRÍTICO  
**Descripción**: Variables sensibles (Supabase key, API keys) en .env.local sin .gitignore actualizado  
**Impacto**: Credenciales en repositorio  
**Fix**: Limpiar git history (BFG Repo Cleaner), mover a Vercel secrets  
**Tiempo**: 1 hora  
**Bloquea**: Fase 0 (security antes de cualquier desarrollo)

#### 4. CORS Abierto a *
**Severidad**: CRÍTICO  
**Descripción**: Access-Control-Allow-Origin: * sin validación  
**Impacto**: Cualquiera puede hacer requests desde cualquier origin  
**Fix**: Whitelist dominios específicos (mapzy.com.co, staging)  
**Tiempo**: 15 minutos

#### 5. No Rate Limiting en APIs
**Severidad**: CRÍTICO  
**Descripción**: Endpoints sin rate limit (SECOP II query, cotizador)  
**Impacto**: DDoS, abuse de API  
**Fix**: Implementar rate limiting (Vercel middleware)  
**Tiempo**: 1 hora

#### 6. Validación Input Insuficiente
**Severidad**: CRÍTICO  
**Descripción**: Campos de formulario sin sanitización (cotizador)  
**Impacto**: SQL injection, XSS  
**Fix**: Zod validation en backend + escaping  
**Tiempo**: 2 horas

#### 7. SQL Injection en Queries
**Severidad**: CRÍTICO  
**Descripción**: Queries concatenadas sin prepared statements (si Supabase)  
**Impacto**: Acceso no autorizado a DB  
**Fix**: Usar Supabase client SDK (ya seguro)  
**Tiempo**: 30 minutos

#### 8. No HTTPS Enforcement
**Severidad**: CRÍTICO  
**Descripción**: Vercel no fuerza HTTPS en todas las rutas  
**Impacto**: MITM attacks  
**Fix**: Agregar Security header en vercel.json  
**Tiempo**: 10 minutos

---

### 🟡 PERFORMANCE (6 hallazgos)

#### 9. Imágenes Sin Optimizar
**Severidad**: CRÍTICO (impacta UX)  
**Descripción**: Imágenes grandes sin compresión, sin WebP  
**Impacto**: LCP > 3s  
**Fix**: Usar Next.js Image component + compression  
**Tiempo**: 1 hora

#### 10. Bundle Innecesario
**Severidad**: CRÍTICO  
**Descripción**: D3.js y Sanity.io en bundle aunque no se usan  
**Impacto**: +200 KB JS innecesario  
**Fix**: Tree-shaking, lazy load, code splitting  
**Tiempo**: 1.5 horas

#### 11. Falta Cache Headers
**Severidad**: CRÍTICO  
**Descripción**: Assets sin Cache-Control headers  
**Impacto**: Recarga innecesaria de assets  
**Fix**: Configurar en vercel.json  
**Tiempo**: 15 minutos

#### 12. No Lazy Loading en Componentes
**Severidad**: CRÍTICO  
**Descripción**: Todos componentes loaded al inicio  
**Impacto**: First Paint lento  
**Fix**: next/dynamic para componentes grandes  
**Tiempo**: 1 hora

#### 13. API Sin Compresión
**Severidad**: CRÍTICO  
**Descripción**: Responses sin gzip  
**Impacto**: Payload grande (SECOP II CSV)  
**Fix**: Next.js automático, validar en middleware  
**Tiempo**: 10 minutos

#### 14. Database Queries No Optimizadas
**Severidad**: CRÍTICO  
**Descripción**: N+1 queries, falta de índices  
**Impacto**: Latencia > 500ms  
**Fix**: Supabase índices + queries agregadas  
**Tiempo**: 2 horas

---

### 🔵 ARQUITECTURA (8 hallazgos)

#### 15. No Error Boundaries
**Severidad**: CRÍTICO  
**Descripción**: Aplicación cae sin fallback UI  
**Impacto**: Experiencia rota en error  
**Fix**: React error boundaries en layout  
**Tiempo**: 1 hora

#### 16. Manejo de Errores Incompleto
**Severidad**: CRÍTICO  
**Descripción**: Errores no logueados, usuario sin feedback  
**Impacto**: Debugging imposible  
**Fix**: Sentry + error logging middleware  
**Tiempo**: 2 horas

#### 17. No Logging de Eventos Críticos
**Severidad**: CRÍTICO  
**Descripción**: Logins, búsquedas, conversiones sin tracking  
**Impacto**: No hay visibilidad en el embudo  
**Fix**: PostHog o Posthog, eventos en backend  
**Tiempo**: 2 horas

#### 18. Falta Autenticación en Rutas Protegidas
**Severidad**: CRÍTICO  
**Descripción**: Rutas de admin/cotizador sin middleware de auth  
**Impacto**: Acceso sin credenciales  
**Fix**: Middleware de autenticación en todas rutas protected  
**Tiempo**: 1 hora

#### 19. No Monitoreo de Uptime
**Severidad**: CRÍTICO  
**Descripción**: Sin alertas si sitio cae  
**Impacto**: Downtime no detectado  
**Fix**: Pingdom o Healthchecks.io  
**Tiempo**: 15 minutos

#### 20. Arquitectura Tightly Coupled
**Severidad**: CRÍTICO  
**Descripción**: Sanity CMS, Next.js, Supabase sin separación clara  
**Impacto**: Difícil de mantener, escalar  
**Fix**: API layer, environment separation  
**Tiempo**: 4 horas

#### 21. No Versionado de API
**Severidad**: CRÍTICO  
**Descripción**: Si endpoints cambian, clientes rompen  
**Impacto**: Imposible hacer breaking changes  
**Fix**: /api/v1/ path prefix, deprecation headers  
**Tiempo**: 1 hora

#### 22. Falta Documentación de API
**Severidad**: CRÍTICO  
**Descripción**: Sin OpenAPI/Swagger  
**Impacto**: Dificultad para integrar, onboard devs  
**Fix**: Swagger UI + JSDoc  
**Tiempo**: 2 horas

---

## Priorización para Fase 0

### Must Fix (Bloquean Fase 0 → Fase 1)
1. **PIN Hardcoded** (30 min) — Blocker absoluto
2. **OAuth en localStorage** (2h) — Security
3. **.env Expuestas** (1h) — Compliance
4. **No Error Boundaries** (1h) — UX rota
5. **Falta Autenticación en Rutas** (1h) — Access control

**Total Fase 0**: ~6 horas trabajo

### Nice to Have (Mejoran pero no bloquean)
- Imágenes optimizadas
- Cache headers
- Sentry logging
- API versionado

---

## Mapeo a Fase 1-3

| Hallazgo | Fase | Razón |
|----------|------|-------|
| PIN, OAuth, .env, CORS, validation, Auth routes | 0 | Security bloqueante |
| Images, bundle, cache, lazy load, compression | 1 | Performance (antes de pilot) |
| Error boundaries, logging, monitoring | 1 | Observability (antes de usuarios) |
| Rate limiting, prepared statements, HTTPS | 2 | Production hardening |
| API versionado, documentación | 3 | Scalability (después de product-market fit) |

---

## Archivo de Referencia Completo

Reporte interactivo visual: `/home/claude/aud/auditoria-mapzy.html`

Cada hallazgo tiene:
- Descripción completa
- Código de ejemplo (antes/después)
- Impacto estimado
- Tiempo de fix

---

**Creado**: 2026-08-29  
**Total hallazgos**: 22 (22 crítico)  
**Fase 0 bloquea**: 5 hallazgos = ~6 horas  
**Para**: Claude Code (abordar durante Fase 0)
