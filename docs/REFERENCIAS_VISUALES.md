# Artefactos Visuales HTML - Ubicación

Los 3 artefactos HTML interactivos están disponibles en:

## 1. Consola de Caza (Radar + Calificador + Cuña)
**Archivo**: `/home/claude/aud/consola-caza.html`
**Tamaño**: 46 KB
**Contiene**:
- Radar SECOP II funcional (consulta datos públicos en vivo)
- Calificador interactivo (5 preguntas)
- Generador de mensajes (4 plantillas)
- Hoja de caza template
- Embudo del piloto

**Para Claude Code**: Usa esto como spec visual para construir componentes React

## 2. Ruta Crítica Mapzy (Plan Maestro)
**Archivo**: `/home/claude/aud/ruta-critica.html`
**Tamaño**: 36.6 KB
**Contiene**:
- 4 Fases reordenadas
- 6 Blockers con estados
- Timeline visual
- Datos de referencia

**Para Claude Code**: Referencia para orden de trabajo (Fase 0 → Fase 3)

## 3. Auditoría Mapzy (22 Hallazgos)
**Archivo**: `/home/claude/aud/auditoria-mapzy.html`
**Tamaño**: 36.6 KB
**Contiene**:
- 22 hallazgos críticos
- Categorizado por severidad
- Must-Fix para Fase 0 (5 items)
- Priorización por fase

**Para Claude Code**: Checklist de fixes de seguridad y arquitectura

---

## Cómo Usarlos

1. **Durante desarrollo**: Abre en navegador para ver spec visual mientras codificas
2. **Para validación**: Compara tu componente React con el prototipo HTML
3. **Para el equipo**: Muestra demostraciones funcionales a Sergio, Javier, Danna

## Acceso desde Claude Code

Cuando estés en Claude Code, puedes:
- Leer las specs Markdown en `/docs/*_SPEC.md`
- Consultar referencias visuales en `/home/claude/aud/*.html`
- Comparar tu implementación React con el prototipo

---

**Creado**: 2026-08-29
