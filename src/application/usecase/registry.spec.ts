import { Registry } from './registry.usecase';
import { Gender } from '../../domain/model/gender.enum';
import { Person } from '../../domain/model/person.entity';
import { RegisterResult } from '../../domain/model/register-result.enum';
import { RegistryRepository } from '../../infrastructure/persistence/registry.repository';

/**
 * Pruebas de integración para el caso de uso Registry, aplicando el formato AAA:
 * - Arrange: preparación de datos y objetos a probar.
 * - Act: ejecución del método bajo prueba.
 * - Assert: verificación de los resultados esperados.
 */
describe('Registry (integración con BD en memoria)', () => {
  let repo: RegistryRepository;
  let registry: Registry;

  beforeEach(() => {
    repo = new RegistryRepository(':memory:');
    repo.initSchema();
    repo.deleteAll();
    registry = new Registry(repo);
  });

  it('shouldRegisterValidPerson', () => {
    // Arrange
    const person = new Person('Ana', 100, 30, Gender.FEMALE, true);

    // Act
    const result = registry.registerVoter(person);

    // Assert
    expect(result).toBe(RegisterResult.VALID);
    expect(repo.existsById(100)).toBe(true);
  });

  it('shouldPersistValidVoterAndRejectDuplicates', () => {
    // Arrange
    const first = new Person('Ana', 100, 30, Gender.FEMALE, true);
    const duplicate = new Person('AnaDos', 100, 40, Gender.FEMALE, true);

    // Act (primer registro)
    const firstResult = registry.registerVoter(first);

    // Assert primer registro
    expect(firstResult).toBe(RegisterResult.VALID);
    expect(repo.existsById(100)).toBe(true);

    // Act (segundo registro con mismo ID)
    const secondResult = registry.registerVoter(duplicate);

    // Assert segundo registro
    expect(secondResult).toBe(RegisterResult.DUPLICATED);
  });
});
