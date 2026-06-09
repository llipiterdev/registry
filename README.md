# Registraduría — NestJS

Adaptación del módulo [registraduria](https://github.com/CesarAVegaF312/TYVS-Taller_Pruebas_Integracion/tree/master/registraduria) para el taller de **Pruebas de Integración y Sistema**.

## Integrantes

Ver [`integrantes.txt`](./integrantes.txt) — completar nombres y correos `@unisabana.edu.co` antes de entregar.

## Comandos

```bash
npm install
npm run verify    # equiv. mvn clean verify
npm run test:cov  # equiv. JaCoCo → coverage/lcov-report/index.html
npm run start:dev
```

## Checklist de entrega

| # | Requisito | Estado |
|---|-----------|--------|
| 1 | Repositorio Git público | ⬜ Pendiente (subir a GitHub) |
| 1 | `.gitignore` | ✅ |
| 1 | `integrantes.txt` | ⚠️ Plantilla — completar datos |
| 1 | Rama ejecutable (`npm run verify`) | ✅ |
| 2 | Wiki en GitHub | ⚠️ Copiar desde `docs/wiki/` |
| 3 | ≥3 pruebas integración BD (VALID, DUPLICATED, UNDERAGE, DEAD) | ✅ 6 tests |
| 4 | ≥2 pruebas mocks + excepción | ✅ 3 tests |
| 5 | ≥2 pruebas HTTP (200, 400, 500) | ✅ 3 tests e2e |
| 6 | Cobertura ≥80% global | ✅ ~85% líneas |
| 7 | Matriz de pruebas | ✅ `docs/matriz-pruebas.md` |
| 8 | `defectos.md` | ✅ 2 defectos documentados |
| 9 | Calidad código (constantes, excepciones) | ✅ |
| 10 | Reflexión final en Wiki | ⚠️ Completar en `docs/wiki/08-Conclusiones.md` |

## Documentación

- Wiki (plantillas): [`docs/wiki/`](./docs/wiki/)
- Matriz de pruebas: [`docs/matriz-pruebas.md`](./docs/matriz-pruebas.md)
- Defectos: [`defectos.md`](./defectos.md)

## Cobertura actual

| Paquete | Líneas |
|---------|--------|
| Global | ~85% |
| `application` | ~96% |
| `delivery` | ~94% |

Reporte: `coverage/lcov-report/index.html` (generar con `npm run test:cov`).
