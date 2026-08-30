# CLAUDE.md - Configuración de Mapzy Web para Claude Code

## Project Overview

**Mapzy Web** es una plataforma B2B de prospección y gestión de clientes orientada al sector de minería artesanal en Colombia. Utiliza SECOP II como fuente principal de datos de oportunidades.

## Core Purpose

Transformar datos públicos de licitaciones (SECOP II) en leads cualificados y gestionar el ciclo de ventas B2B con herramientas de prospección automatizada.

## Key Constraints & Context

- **Critical Security Issue**: PIN 2326 en cotizador es client-side (línea 180 de JavaScript) - **FIX PRIORITY 1**
- **Hosting Risk**: mapzy.com.co es comercial pero podría estar en Vercel Hobby (que prohibe uso comercial) - **VERIFY PLAN**
- **Database Risk**: Supabase free pauses después de 7 días inactivity - require Pro ($25/mo) para producción
- **Cost Reality**: USD 45-55/mes (Vercel Pro $20 + Supabase Pro $25)
- **Scarcest Resource**: Tiempo de negociación de Sergio (no capital)

## Development Phases (Compuertas Model)

### Fase 0: Critical Fixes (0-cost, blocking)
1. ✅ Remove client-side PIN from cotizador
2. ⚠️ Verify Vercel plan (should be Pro, not Hobby)
3. ✅ Confirm Supabase upgrade path
4. 🔄 Delete .git/index.lock (done)
5. 📝 Create CLAUDE.md (this file)
6. 🔧 Resolve other 5 critical audit findings

**Gate**: All 6 items done before moving to Fase 1

### Fase 1: SECOP II Hunting (0 dependencies)
- Consola de Caza: B2B prospecting tool with SECOP II integration
- Calificador: Scoring system for lead quality
- Message Templates: Pre-approved outreach copy
- Gate: 20 prospectos qualified (entrada a Fase 2)

### Fase 2: Sales Pipeline  
- Cotizador: Quote generation (with PIN fixed)
- CRM integration: Track conversations
- Gate: 2 conversations active (entrada a Fase 3)

### Fase 3: Contract Automation
- Contract templates
- e-Signature integration
- Gate: 1 contract closed (entrada a Fase 4)

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **CMS**: Sanity
- **Auth**: Google OAuth2 (setup documented)
- **Hosting**: Vercel
- **Data Source**: SECOP II via datos.gov.co (dataset: p6dx-8zbt)

## Key Files & Modules

- `.env.local` - Environment variables (credentials)
- `src/` - Application source
- `sanity.config.ts` - CMS configuration
- `MANUAL_CONEXION_GOOGLE_DRIVE_OAUTH2.md` - OAuth setup guide
- `MANUAL_MAPZY_ROADMAP.md` - Original roadmap (superseded by compuertas model)
- `GUIA_CONTENIDO_Y_DESARROLLO.md` - Content & development guide

## Recent Audit Findings

**22 Critical Audit Issues** (from auditoria-mapzy.html):
- Security: PIN visibility, OAuth tokens, environment variables
- Performance: Unoptimized images, missing cache headers
- Architecture: Missing error boundaries, no rate limiting
- Compliance: No GDPR/data retention policy

**Status**: 6 critical blocking items. Rest addressed in phases 1-3.

## Team Role Distribution

| Role | Tool | Responsibility |
|------|------|-----------------|
| Sergio | Claude Code | Architecture, critical fixes, git commits |
| Claude (Cowork) | Cowork | Documentation, planning, research |
| Claude (App) | Chat | Quick questions, brainstorming |

## Permission Modes

- Default: Ask for each action (safest)
- Plan: Show architecture before coding
- Acceptedits: Skip confirmation on edits
- Auto: Full autonomy (use sparingly)

## Next Steps (Claude Code)

1. Run `/import` - Analyze project structure
2. Run `/init` - Setup CLAUDE.md (creates/updates this file)
3. Execute Fase 0 fixes (6 items):
   - Remove PIN from cotizador
   - Verify Vercel plan
   - Fix audit findings
4. Commit changes to git

## Resources

- SECOP II Dataset: https://datos.gov.co/dataset/p6dx-8zbt
- Supabase Pricing: https://supabase.com/pricing
- Vercel Pricing: https://vercel.com/pricing
- Migration Guide: /home/claude/aud/antigravity-a-claude.html

## Created

2026-08-29 by Claude (Haiku 4.5) in Cowork mode
For Claude Code terminal-native execution.

---

**Última actualización**: 2026-08-29
**Versión**: 1.0 (Initial setup)
