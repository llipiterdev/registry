# Registry — Registraduría (NestJS)

[![CI](https://github.com/llipiterdev/registry/actions/workflows/ci.yml/badge.svg)](https://github.com/llipiterdev/registry/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/llipiterdev/registry/graph/badge.svg)](https://codecov.io/gh/llipiterdev/registry)

Servicio REST para registro de votantes, desarrollado en **NestJS** con **arquitectura limpia** (hexagonal). Es la adaptación del módulo [`registraduria`](https://github.com/CesarAVegaF312/TYVS-Taller_Pruebas_Integracion/tree/master/registraduria) del taller de Pruebas de Integración y Sistema (Universidad de La Sabana).

## ¿Qué hace?

Expone un endpoint `POST /register` que recibe los datos de una persona y devuelve el resultado del registro como texto plano:

| Resultado | Significado |
|-----------|-------------|
| `VALID` | Registro exitoso |
| `DUPLICATED` | El ID ya existe |
| `UNDERAGE` | Menor de 18 años |
| `DEAD` | Persona fallecida |
| `INVALID` | Datos inválidos (ID ≤ 0) |

## Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** NestJS
- **Base de datos:** SQLite en memoria (`better-sqlite3`)
- **Pruebas:** Jest + supertest

## Estructura del proyecto

```
src/
├── domain/           # Modelos, enums, constantes, excepciones
├── application/      # Casos de uso y puertos
├── infrastructure/   # Persistencia (RegistryRepository)
├── delivery/         # Controller REST y filtros HTTP
└── config/           # Providers e inyección de dependencias

test/
└── delivery/rest/    # Pruebas de sistema (e2e)
```

## Requisitos

- Node.js ≥ 18
- npm ≥ 9

## Instalación

```bash
git clone https://github.com/llipiterdev/registry.git
cd registry
npm install
```

## Comandos

```bash
# Desarrollo
npm run start:dev

# Compilar
npm run build

# Producción
npm run start:prod

# Tests unitarios e integración
npm test

# Tests de sistema (HTTP)
npm run test:e2e

# Cobertura (reporte en coverage/lcov-report/index.html)
npm run test:cov

# Build + tests + cobertura (equiv. mvn verify)
npm run verify
```

## CI (GitHub Actions)

En cada **pull request** y cada **push a `main`** se ejecuta el pipeline de integración continua:

- Pruebas unitarias e integración con cobertura (`npm run test:ci`)
- Pruebas e2e (`npm run test:e2e:ci`)
- Análisis estático (`npm run lint:ci`)
- Compilación (`npm run build`)
- Publicación de reportes a GitHub y [Codecov](https://codecov.io/gh/llipiterdev/registry)

Workflow: [`.github/workflows/ci.yml`](./.github/workflows/ci.yml)

### Reportes visibles en GitHub

| Dónde | Qué verás |
|-------|-----------|
| **Checks → Jest** | Lista de tests pasados/fallidos |
| **Summary del job** | Tabla markdown con % de cobertura global |
| **Comentario en el PR** | [Codecov](https://codecov.io/gh/llipiterdev/registry) — diff de cobertura vs `main` |
| **Artifacts** | Reporte HTML descargable (`coverage-report`) |
| **Dashboard Codecov** | Gráficos, historial y detalle por archivo |

## API

**`POST /register`**

```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ana","id":100,"age":30,"gender":"FEMALE","alive":true}'
```

**Respuesta:** `200 OK` — body: `VALID` (text/plain)

## Documentación

| Recurso | Enlace |
|---------|--------|
| **Wiki del proyecto** | [Registry Wiki](https://github.com/llipiterdev/registry/wiki/Registry-Wiki) |
| Matriz de pruebas | [`docs/matriz-pruebas.md`](./docs/matriz-pruebas.md) |
| Gestión de defectos | [`defectos.md`](./defectos.md) |
| Integrantes | [`integrantes.txt`](./integrantes.txt) |

La Wiki incluye arquitectura, tipos de pruebas, evidencias de ejecución, cobertura y conclusiones técnicas.

## Referencias

- Taller original (Java/Spring Boot): [TYVS-Taller_Pruebas_Integracion](https://github.com/CesarAVegaF312/TYVS-Taller_Pruebas_Integracion)

## Licencia

Proyecto académico — UNLICENSED.
