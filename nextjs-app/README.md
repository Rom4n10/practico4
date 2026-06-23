# HealthAdmin — Next.js App

Aplicación del práctico 4: módulos M03 (Tipos de Evento) y M04 (Reservas), con UI portada desde `ics/`, 18 tests unitarios y CI en GitHub Actions.

## Requisitos

- Node.js 20+
- npm

## Comandos

```bash
npm install
npm run dev          # servidor de desarrollo
npm run test         # 18 pruebas unitarias (obligatorio antes de PR)
npm run test:watch   # tests en modo watch
npm run build        # build de producción
npm run start        # servir build (después de build)
```

## Rutas

| URL | Contenido |
|-----|-----------|
| http://localhost:3000 | Tipos de Evento — panel admin (M03) |
| http://localhost:3000/reservas | Flujo de reserva mobile (M04) |

## Tests (consigna 2)

6 suites × 3 tests = **18 tests** cubriendo US_003–US_023. Los archivos en `src/__tests__/` no deben modificarse.

```bash
npm run test
```

## CI (consigna 4)

El pipeline en `.github/workflows/ci.yml` ejecuta `npm ci`, `npm run test` y `npm run build` en cada PR y push a `main`.
