import { Registry } from './registry.usecase';
import { RegistryRepositoryPort } from '../port/out/registry-repository.port';
import { Gender } from '../../domain/model/gender.enum';
import { Person } from '../../domain/model/person.entity';
import { RegisterResult } from '../../domain/model/register-result.enum';

/**
 * Pruebas unitarias para Registry utilizando un mock de RegistryRepositoryPort.
 *
 * Estas pruebas ilustran cómo aislar el caso de uso del repositorio real,
 * aplicando dobles de prueba (Jest) para simular los escenarios.
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
});
