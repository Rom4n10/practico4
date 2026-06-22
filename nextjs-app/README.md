# HealthAdmin — Next.js App

Aplicación del práctico 4 con componentes React, pruebas unitarias (Jest) y rutas funcionales.

## Requisitos

- Node.js 20+
- npm

## Comandos

```bash
npm install
npm run dev          # servidor de desarrollo
npm run test         # pruebas unitarias (18 tests)
npm run test:watch   # tests en modo watch
npm run build        # build de producción
npm run start        # servir build (después de build)
```

## Rutas

| URL | Contenido |
|-----|-----------|
| http://localhost:3000 | Landing HealthAdmin |
| http://localhost:3000/admin | Panel de administración (filtros, creación, estados) |
| http://localhost:3000/reservas | Calendario, datos del paciente y confirmación |

## Tests

Los tests cubren historias de usuario US_003–US_023 en `src/__tests__/components/`.

```bash
npm run test
```

## CI

El pipeline en `.github/workflows/ci.yml` ejecuta `npm ci`, `npm run test` y `npm run build` en cada PR y push a `main`.
