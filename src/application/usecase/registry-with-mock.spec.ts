import { Registry } from './registry.usecase';
import { RegistryRepositoryPort } from '../port/out/registry-repository.port';
import { RegistryPersistenceException } from '../../domain/exceptions/registry-persistence.exception';
import { Gender } from '../../domain/model/gender.enum';
import { Person } from '../../domain/model/person.entity';
import { RegisterResult } from '../../domain/model/register-result.enum';

/**
 * Pruebas con mocks del repositorio (equivalente a RegistryWithMockTest.java con Mockito).
 * Aíslan el caso de uso sin levantar base de datos real.
 */
describe('Registry (con mock del repositorio)', () => {
  let repo: jest.Mocked<RegistryRepositoryPort>;
  let registry: Registry;

  beforeEach(() => {
    repo = {
      initSchema: jest.fn(),
      existsById: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      deleteAll: jest.fn(),
    };
    registry = new Registry(repo);
  });

  /**
   * Propósito: simular que el repositorio ya tiene el ID y verificar que no se invoca save().
   * Equivalente a verify(repo, never()).save(...) en Mockito.
   */
  it('shouldReturnDuplicatedWhenRepoSaysExists', () => {
    // Arrange
    repo.existsById.mockReturnValue(true);
    const person = new Person('Ana', 7, 25, Gender.FEMALE, true);

    // Act
    const result = registry.registerVoter(person);

    // Assert
    expect(result).toBe(RegisterResult.DUPLICATED);
    expect(repo.save).not.toHaveBeenCalled();
  });

  /**
   * Propósito: simular registro exitoso y verificar que save() se invoca con los datos correctos.
   * Equivalente a verify(repo).save(...) en Mockito.
   */
  it('shouldCallSaveWhenPersonIsValid', () => {
    // Arrange
    repo.existsById.mockReturnValue(false);
    const person = new Person('Carlos', 200, 25, Gender.MALE, true);

    // Act
    const result = registry.registerVoter(person);

    // Assert
    expect(result).toBe(RegisterResult.VALID);
    expect(repo.save).toHaveBeenCalledWith(200, 'Carlos', 25, true);
    expect(repo.save).toHaveBeenCalledTimes(1);
  });

  /**
   * Propósito: simular fallo de persistencia y verificar que el caso de uso propaga la excepción.
   * Equivalente a when(repo.save(...)).thenThrow(...) en Mockito.
   */
  it('shouldThrowPersistenceExceptionWhenSaveFails', () => {
    // Arrange
    repo.existsById.mockReturnValue(false);
    repo.save.mockImplementation(() => {
      throw new Error('SQLITE_CONSTRAINT');
    });
    const person = new Person('María', 300, 30, Gender.FEMALE, true);

    // Act & Assert
    expect(() => registry.registerVoter(person)).toThrow(
      RegistryPersistenceException,
    );
    expect(() => registry.registerVoter(person)).toThrow(/Persistencia:/);
    expect(repo.save).toHaveBeenCalled();
  });
});
