# AgendaYa — Práctico 4

Sistema de gestión de agenda para administrar tipos de eventos y reservar turnos.

**Repositorio:** https://github.com/Rom4n10/practico4

![CI Pipeline](https://github.com/Rom4n10/practico4/actions/workflows/ci.yml/badge.svg)

## Estructura

| Carpeta | Descripción |
|---------|-------------|
| [`nextjs-app/`](nextjs-app/) | Aplicación principal (Next.js 16 + React 19 + Jest) |
| [`ics/`](ics/) | Prototipo estático HTML/CSS de referencia (wireframes TP 1–3) |
| [`.github/workflows/`](.github/workflows/) | Pipeline CI (tests + build) |

## Inicio rápido

```bash
cd nextjs-app
npm install
npm run dev      # http://localhost:3001
npm run test     # 18 pruebas unitarias
npm run build    # build de producción
```

## Rutas de la aplicación

| Ruta | Módulo |
|------|--------|
| `/` | Tipos de Evento — administración (M03) |
| `/reservas` | Flujo de reservas público (M04) |
| `/admin` | Redirige a `/` |

## Prototipo estático (referencia)

```bash
cd ics
python3 -m http.server 8081
```

- Admin: http://localhost:8081/index.html
- Reservas: http://localhost:8081/booking.html
