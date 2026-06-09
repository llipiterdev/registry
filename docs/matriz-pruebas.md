# Matriz de pruebas de integración

| Caso | Entrada | Resultado esperado | Tipo | Test |
|------|---------|-------------------|------|------|
| Persona válida | ID=100, edad=30, alive=true | `VALID` + persistido en BD | SQLite (H2 equiv.) | `shouldRegisterValidPerson` |
| Persona duplicada | ID=100 ya existente | `DUPLICATED` | SQLite (H2 equiv.) | `shouldReturnDuplicatedWhenIdExists` |
| Persona menor de edad | ID=101, edad=17 | `UNDERAGE` + no persistido | SQLite (H2 equiv.) | `shouldReturnUnderageWhenPersonIsMinor` |
| Persona fallecida | ID=102, alive=false | `DEAD` + no persistido | SQLite (H2 equiv.) | `shouldReturnDeadWhenPersonIsNotAlive` |
| ID inválido | ID=0 | `INVALID` + no persistido | SQLite (H2 equiv.) | `shouldReturnInvalidWhenIdIsNotValid` |
| Duplicado simulado | existsById(7)=true | `DUPLICATED`, save nunca invocado | Mock (Jest) | `shouldReturnDuplicatedWhenRepoSaysExists` |
| Registro con mock | existsById(200)=false | `VALID`, save invocado | Mock (Jest) | `shouldCallSaveWhenPersonIsValid` |
| Fallo de persistencia | save() lanza excepción | `RegistryPersistenceException` | Mock (Jest) | `shouldThrowPersistenceExceptionWhenSaveFails` |
| Registro HTTP exitoso | JSON válido vía POST | HTTP 200, body `VALID` | HTTP (supertest) | `shouldRegisterValidPerson` |
| Género inválido HTTP | gender=INVALIDO | HTTP 400 | HTTP (supertest) | `shouldReturn400WhenGenderIsInvalid` |
| Fallo persistencia HTTP | save() mock falla | HTTP 500, body con `Persistencia:` | HTTP (supertest) | `shouldReturn500WhenPersistenceFails` |
