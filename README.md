# Registraduría — NestJS

Adaptación en **NestJS** del módulo `registraduria` del taller [TYVS-Taller_Pruebas_Integracion](https://github.com/CesarAVegaF312/TYVS-Taller_Pruebas_Integracion/tree/master/registraduria).

Servicio de registro de votantes con **arquitectura limpia** (hexagonal): el caso de uso `Registry` valida reglas de negocio y persiste a través del puerto `RegistryRepositoryPort`.

---

## Estructura del proyecto

Equivalente a la estructura descrita en el README del taller Java:

```
src/
├── main.ts
├── app.module.ts
├── registry.module.ts
├── config/
│   └── registry.config.ts              ← RegistryConfig (providers/DI)
├── domain/model/
│   ├── gender.enum.ts                ← Gender
│   ├── person.entity.ts              ← Person
│   ├── register-result.enum.ts       ← RegisterResult
│   ├── registry.constants.ts         ← MIN_VOTER_AGE
│   └── rq/person.dto.ts              ← PersonDTO
├── application/
│   ├── usecase/
│   │   ├── registry.usecase.ts       ← Registry
│   │   ├── registry.spec.ts          ← RegistryTest (integración)
│   │   └── registry-with-mock.spec.ts← RegistryWithMockTest (mock)
│   └── port/out/
│       └── registry-repository.port.ts
├── infrastructure/persistence/
│   ├── registry-record.entity.ts
│   └── registry.repository.ts        ← SQLite en memoria (equiv. H2)
└── delivery/rest/
    └── registry.controller.ts        ← POST /register

test/delivery/rest/
└── registry.controller.e2e-spec.ts   ← RegistryControllerIT (sistema)
```

---

## Equivalencias Java → NestJS

| Concepto Java | Equivalente NestJS |
|---------------|-------------------|
| Spring Boot | NestJS |
| H2 en memoria | better-sqlite3 (`:memory:`) |
| JUnit 4 | Jest |
| Mockito | `jest.fn()` / `jest.Mocked` |
| `mvn test` | `npm test` |
| `mvn verify` | `npm run verify` |
| JaCoCo | `npm run test:cov` (coverage/) |
| `RegistryControllerIT` | `registry.controller.e2e-spec.ts` |

---

## API

**`POST /register`**

- **Content-Type:** `application/json`
- **Response:** `text/plain` con el nombre del resultado
- **HTTP Status:** `200 OK`

### Cuerpo de ejemplo

```json
{
  "name": "Ana",
  "id": 100,
  "age": 30,
  "gender": "FEMALE",
  "alive": true
}
```

### Resultados posibles (`RegisterResult`)

| Resultado | Condición |
|-----------|-----------|
| `VALID` | Persona válida y persistida |
| `INVALID` | Persona nula o `id <= 0` |
| `DEAD` | `alive: false` |
| `UNDERAGE` | `age < 18` |
| `DUPLICATED` | El `id` ya existe en BD |

---

## Reglas de negocio (`Registry.registerVoter`)

1. Rechaza persona nula o con id inválido → `INVALID`
2. Rechaza persona fallecida → `DEAD`
3. Rechaza menor de edad (< `MIN_VOTER_AGE`) → `UNDERAGE`
4. Consulta duplicados en repositorio → `DUPLICATED`
5. Persiste y retorna → `VALID`
6. Error de persistencia → excepción con prefijo `Persistencia:`

---

## Configuración e instalación

```bash
npm install
```

## Ejecución

```bash
# desarrollo
npm run start:dev

# producción
npm run build
npm run start:prod
```

## Pruebas

```bash
# unitarias + integración (src/**/*.spec.ts)
npm test

# pruebas de sistema HTTP (test/**/*.e2e-spec.ts)
npm run test:e2e

# unitarias + integración + sistema (equiv. mvn verify)
npm run verify

# cobertura (equiv. JaCoCo)
npm run test:cov
```

### Tipos de prueba incluidos (base del taller)

| Tipo | Archivo | Descripción |
|------|---------|-------------|
| Integración (BD) | `registry.spec.ts` | `Registry` + `RegistryRepository` real en memoria |
| Mock | `registry-with-mock.spec.ts` | Mock del puerto, verifica `save` no invocado |
| Sistema (HTTP) | `registry.controller.e2e-spec.ts` | `POST /register` → `200` + `"VALID"` |

---

## Prueba manual con curl

```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ana","id":100,"age":30,"gender":"FEMALE","alive":true}'
```

Respuesta esperada: `VALID`

---

## Pendiente para la entrega del taller

Según el README del taller Java, aún faltan implementar (próxima fase):

- Casos adicionales: `UNDERAGE`, `DEAD`, `INVALID` en pruebas de integración
- Más pruebas con mocks (`verify(save)`, excepciones simuladas)
- Más pruebas HTTP (400, duplicados, menores de edad)
- Cobertura ≥ 80% con reporte
- Wiki, matriz de pruebas, `defectos.md`, `integrantes.txt`

---

## Referencia

Taller original: [TYVS-Taller_Pruebas_Integracion](https://github.com/CesarAVegaF312/TYVS-Taller_Pruebas_Integracion)

Autor del taller: César Augusto Vega Fernández — Universidad de La Sabana
# registry
