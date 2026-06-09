import { Registry } from './registry.usecase';
import { Gender } from '../../domain/model/gender.enum';
import { Person } from '../../domain/model/person.entity';
import { RegisterResult } from '../../domain/model/register-result.enum';
import { RegistryRepository } from '../../infrastructure/persistence/registry.repository';

/**
 * Pruebas de integración para el caso de uso Registry con base de datos real en memoria.
 * Equivalente a RegistryTest.java del taller (H2 → SQLite en NestJS).
 *
 * Formato AAA: Arrange – Act – Assert.
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

  /**
   * Propósito: verificar que una persona válida se persiste en la base de datos.
   */
  it('shouldRegisterValidPerson', () => {
    // Arrange
    const person = new Person('Ana', 100, 30, Gender.FEMALE, true);

    // Act
    const result = registry.registerVoter(person);

    // Assert
    expect(result).toBe(RegisterResult.VALID);
    expect(repo.existsById(100)).toBe(true);
    expect(repo.findById(100)?.name).toBe('Ana');
  });

  /**
   * Propósito: verificar detección de duplicados consultando la BD real.
   */
  it('shouldReturnDuplicatedWhenIdExists', () => {
    // Arrange
    const first = new Person('Ana', 100, 30, Gender.FEMALE, true);
    const duplicate = new Person('AnaDos', 100, 40, Gender.FEMALE, true);

    // Act
    const firstResult = registry.registerVoter(first);
    const secondResult = registry.registerVoter(duplicate);

    // Assert
    expect(firstResult).toBe(RegisterResult.VALID);
    expect(secondResult).toBe(RegisterResult.DUPLICATED);
    expect(repo.findById(100)?.name).toBe('Ana');
  });

  /**
   * Propósito: verificar que un menor de edad no se persiste en la BD.
   */
  it('shouldReturnUnderageWhenPersonIsMinor', () => {
    // Arrange
    const minor = new Person('Pedro', 101, 17, Gender.MALE, true);

    // Act
    const result = registry.registerVoter(minor);

    // Assert
    expect(result).toBe(RegisterResult.UNDERAGE);
    expect(repo.existsById(101)).toBe(false);
  });

  /**
   * Propósito: verificar que una persona fallecida no se persiste en la BD.
   */
  it('shouldReturnDeadWhenPersonIsNotAlive', () => {
    // Arrange
    const deceased = new Person('Luis', 102, 45, Gender.MALE, false);

    // Act
    const result = registry.registerVoter(deceased);

    // Assert
    expect(result).toBe(RegisterResult.DEAD);
    expect(repo.existsById(102)).toBe(false);
  });

  /**
   * Propósito: verificar rechazo de persona nula.
   */
  it('shouldReturnInvalidWhenPersonIsNull', () => {
    const result = registry.registerVoter(null);
    expect(result).toBe(RegisterResult.INVALID);
  });

  /**
   * Propósito: verificar rechazo de ID inválido sin persistir.
   */
  it('shouldReturnInvalidWhenIdIsNotValid', () => {
    const person = new Person('Ana', 0, 30, Gender.FEMALE, true);
    const result = registry.registerVoter(person);
    expect(result).toBe(RegisterResult.INVALID);
    expect(repo.existsById(0)).toBe(false);
  });
});
