# Gitflow — Pragmatik

Este documento describe el flujo de ramas y los comandos de automatización
disponibles en este repositorio.

## Estructura de ramas

```
main        ← producción; solo recibe merges de staging o hotfix
staging     ← pre-release; recibe merges de release/* y develop
develop     ← integración; recibe features, fixes y syncs de release/hotfix
feature/*   ← nuevas funcionalidades (base: develop)
fix/*       ← bugfixes normales (base: develop)
release/*   ← preparación de release (base: develop → merge a staging + main)
hotfix/*    ← fix urgente en producción (base: main → merge a main + develop)
```

## Comandos

Todos los comandos se pueden invocar directamente o mediante los atajos de npm.

### Estado del flujo

```bash
npm run gf:status
# ó
node scripts/gitflow.js status
```

Muestra todas las ramas del flujo, sus SHA, adelanto/atraso respecto a su base,
y el último tag.

---

### Feature — nueva funcionalidad

```bash
# Crear rama desde develop
npm run gf:feature -- start mi-feature

# Trabajar normalmente…
git add . && git commit -m "Implement mi-feature"

# Merge --no-ff a develop y borrar rama
npm run gf:feature -- finish mi-feature
```

---

### Fix — bugfix normal (desde develop)

```bash
npm run gf:fix -- start nombre-del-fix
# … hacer commits …
npm run gf:fix -- finish nombre-del-fix
```

---

### Release — cerrar una versión

```bash
# Crear rama release/1.2.0 desde develop (bumps VERSION automáticamente)
npm run gf:release -- start 1.2.0

# Ajustes finales de release (changelog, docs, etc.)
git commit -am "Prepare release 1.2.0"

# Merge --no-ff a staging + main, tag v1.2.0, sync a develop
npm run gf:release -- finish 1.2.0

# Push manual (o agregar --push al finish para automático)
git push origin main staging develop v1.2.0
```

---

### Hotfix — fix urgente en producción

```bash
# Crear rama hotfix/1.2.1 desde main (bumps VERSION automáticamente)
npm run gf:hotfix -- start 1.2.1

# Hacer el fix
git commit -am "Fix critical bug in production"

# Merge --no-ff a main + develop + staging, tag v1.2.1
npm run gf:hotfix -- finish 1.2.1
```

---

### Promote — promover entre ambientes

```bash
# Pasar develop a staging (sin versión nueva)
npm run gf:promote -- staging

# Pasar staging a main con tag automático desde VERSION
npm run gf:promote -- main
```

---

## Flags disponibles

| Flag | Descripción |
|---|---|
| `--push` | Hace push de las ramas y tags afectados al terminar |
| `--dry-run` | Imprime los comandos git sin ejecutarlos |

Ejemplo:

```bash
node scripts/gitflow.js release finish 1.2.0 --push
node scripts/gitflow.js release finish 1.2.0 --dry-run
```

---

## Flujo completo de release — resumen visual

```
develop ──────────────────────────────────────────────► develop
         \                                        /
          release/1.2.0 ──────────────────────────
                         \              \
                          staging        main (tag v1.2.0)
```

## Reglas

- Nunca hacer merge directo a `main` sin pasar por el flujo.
- Usar `--no-ff` siempre (lo hace el script automáticamente).
- Los tags son locales hasta que hagas push con `--push` o manualmente.
- No hacer push de tags sin aprobación del equipo.
