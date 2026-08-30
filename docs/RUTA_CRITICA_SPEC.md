# Ruta Crítica Mapzy - Plan Maestro de Evolución

## Resumen Ejecutivo

Evaluación de los **4 bloqueadores críticos** que impiden avanzar a Fase 1 de la Consola de Caza.

**Artefacto visual completo**: `/home/claude/aud/ruta-critica.html` (dashboard interactivo)

## El Problema

El Plan Maestro original (6 frentes de desarrollo simultáneamente) **viola el principio de compuertas**:
- Agrega 6 nuevas variables de entorno sin resolver primero los 5 blockers críticos
- Propone RAG para responder preguntas sobre capacidades (el problema NO es información; es criterio de caza)
- Contradice la estrategia B2B (pushea inbound marketing para mercado institucional que requiere outbound)
- Mantiene la arquitectura vieja (Sanity CMS) que no escala con SECOP II

## 4 Fases Reordenadas con Compuertas (Gates)

### Fase 0: Críticos (Bloqueadores) — 0 deps
**Estado**: En ejecución  
**Duración**: 2-3 días  
**Gate**: Todos 6 items completados antes de pasar a Fase 1

Seis fixes que deben estar hechos:
1. ✅ Remove PIN 2326 from cotizador (client-side security)
2. ⚠️ Verify Vercel plan (Hobby vs Pro commercial use)
3. ✅ Confirm Supabase upgrade path ($25/mo for production)
4. 🔄 Delete .git/index.lock (git operations blocked)
5. 📝 Create CLAUDE.md (project context for Claude Code)
6. 🔧 Resolve 5 critical audit findings (security, perf, architecture)

### Fase 1: SECOP II Hunting — 0 dependencies
**Status**: Ready to start  
**Deliverables**:
- Consola de Caza (Radar + Calificador + Cuña)
- Hoja de Caza (Google Sheets, no DB)
- Message templates (pre-approved copy)

**Gate**: 20 prospectos qualificados (entrada a Fase 2)  
**Cost**: $0 (uses public APIs, Sheets)  
**Time**: 1-2 weeks with Danna + Sergio

### Fase 2: Sales Pipeline — Gate: 2 active conversations
**Deliverables**:
- CRM integration (track conversations)
- Cotizador component (with PIN fixed)
- Proposal templates

**Cost**: Supabase $25/mo minimum  
**Time**: 2-3 weeks

### Fase 3: Contract Automation — Gate: 1 contract closed
**Deliverables**:
- Contract templates
- e-Signature (DocuSign or similar)
- Reporting dashboard

**Cost**: $20-50/mo (e-signature SaaS)  
**Time**: 3-4 weeks

## Blockers Resueltos

### Blocker 1: PIN Security ✅
**Issue**: PIN 2326 hardcoded client-side en cotizador (línea 180)
**Fix**: Move to backend environment variable, validate server-side
**Impact**: Removes single largest security vulnerability

### Blocker 2: Vercel Plan Risk ⚠️
**Issue**: mapzy.com.co es comercial; Vercel Hobby plan prohibe commercial use
**Fix**: Upgrade to Vercel Pro ($20/mo)
**Impact**: Ensures platform legitimacy for production

### Blocker 3: Supabase Persistence ✅
**Issue**: Free tier pauses after 7 days of inactivity
**Fix**: Upgrade to Supabase Pro ($25/mo)
**Impact**: Database stays live; required for CRM + Hoja de Caza

### Blocker 4: Git Operations 🔄
**Issue**: .git/index.lock blocks all commits
**Fix**: Delete lock file, clean state
**Impact**: Git workflow unblocked; ready for CI/CD

### Blocker 5: Project Context 📝
**Issue**: No CLAUDE.md means Claude Code starts cold
**Fix**: Created CLAUDE.md with Fase 0-3, constraints, team roles
**Impact**: Claude Code has full context; can make informed decisions

### Blocker 6: Audit Findings 🔧
**Issue**: 22 findings from security audit; 5 are blocking
**Fix**: Prioritize + fix in order: security > performance > architecture
**Impact**: Platform passes basic compliance checks

## Datos de Referencia

### Embudo Esperado (Semana 1 de Fase 1)
- **30 entidades tamizadas** (Radar + SECOP II)
- **10 califican** (Calificador ≥ 7 pts)
- **5 cuñas enviadas** (Mensaje de primer contacto)
- **2 conversaciones agendadas** (Entrada a Fase 2)
- **1 propuesta armada a mano** (Fin de Fase 1)

### Costo Operativo Total
- Vercel Pro: $20/mes
- Supabase Pro: $25/mes
- **Total**: $45/mes USD ≈ $225 COP/mes
- **Scarcest resource**: Tiempo de negociación de Sergio (no capital)

### Verticales de Oportunidad
| Vertical | Target | Gatillo | Ticket | Cazador |
|----------|--------|---------|--------|---------|
| V1 · Institucional | Alcaldías, ANM, CAR | Documento vencido | $18,5M–$120M | Sergio + Danna |
| V2 · Territorial | Constructoras, minería | Proyecto en marcha | $2,5M–$32M | Javier |
| V3 · Corporativo | Empresas ISO 14001 | Auditoría cercana | $8M–$30M | Danna |

## Cambios vs Plan Maestro Original

| Aspecto | Original | Reordenado | Razón |
|---------|----------|-----------|-------|
| **Arquitectura** | Mantiene Sanity CMS | Mapzy es la data (SECOP II) | SECOP es fuente de verdad, no Sanity |
| **Marketing** | Inbound (blog, SEO) | Outbound (prospectos) | B2B alto ticket requiere personal touch |
| **Variables env** | +6 sin resolver blockers | Resuelve 6 blockers primero | Gates aseguran éxito incremental |
| **RAG** | Responder capacidades | Criterio humano en Calificador | Problema no es información; es decisión |
| **Timeline** | 6 frentes simultáneamente | 4 fases secuenciales | Reduce riesgo; cada gate valida antes de siguiente |

## Implementación en Claude Code

Fase 0 (esta semana):
1. `/import` — Analyze mapzy-web structure
2. `/init` — Setup CLAUDE.md
3. Fix 6 blockers (PIN, Vercel, Supabase, git, audit findings)
4. `/commit` — Stage all changes

Fase 1 (next week):
1. Build Consola de Caza components (Radar, Calificador, Cuña)
2. Deploy to mapzy.com.co/caza
3. Run 7-day pilot with Danna + Sergio

---

**Creado**: 2026-08-29  
**Referencia visual**: `/home/claude/aud/ruta-critica.html`  
**Para**: Claude Code execution (Fase 0 priorities)
