# Gestión de defectos — Taller de Pruebas de Integración

## Defecto #1 — Código HTTP incorrecto en registro exitoso

| Campo | Detalle |
|-------|---------|
| **Caso probado** | `POST /register` con persona válida (`shouldRegisterValidPerson`) |
| **Resultado esperado** | HTTP `200 OK` con body `VALID` |
| **Resultado obtenido** | HTTP `201 Created` con body `VALID` |
| **Causa probable** | NestJS asigna `201` por defecto en peticiones `POST`, a diferencia de Spring Boot que devuelve `200` |
| **Estado** | Cerrado |
| **Evidencia** | Se corrigió agregando `@HttpCode(200)` en `RegistryController.register()` |

```text
# Antes de la corrección (supertest):
expected 200 "OK", got 201 "Created"
```

---

## Defecto #2 — Género inválido sin respuesta HTTP clara

| Campo | Detalle |
|-------|---------|
| **Caso probado** | `POST /register` con `"gender": "INVALIDO"` |
| **Resultado esperado** | HTTP `400 Bad Request` con mensaje descriptivo |
| **Resultado obtenido** | HTTP `500 Internal Server Error` (antes del filtro de excepciones) |
| **Causa probable** | El controller lanzaba `Error` genérico al parsear el enum, sin mapeo a código HTTP |
| **Estado** | Cerrado |
| **Evidencia** | Se implementó `InvalidGenderException` + `RegistryExceptionFilter` → ahora retorna `400` |

```text
# Respuesta actual:
HTTP/1.1 400 Bad Request
Content-Type: text/plain

Género inválido: INVALIDO
```
