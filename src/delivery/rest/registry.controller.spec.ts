import { RegistryController } from './registry.controller';
import { Registry } from '../../application/usecase/registry.usecase';
import { InvalidGenderException } from '../../domain/exceptions/invalid-gender.exception';
import { Gender } from '../../domain/model/gender.enum';
import { RegisterResult } from '../../domain/model/register-result.enum';

describe('RegistryController', () => {
  let controller: RegistryController;
  let registry: jest.Mocked<Pick<Registry, 'registerVoter'>>;

  beforeEach(() => {
    registry = { registerVoter: jest.fn() };
    controller = new RegistryController(registry as unknown as Registry);
  });

  it('shouldReturnRegisterResultFromUseCase', () => {
    registry.registerVoter.mockReturnValue(RegisterResult.VALID);

    const result = controller.register({
      name: 'Ana',
      id: 100,
      age: 30,
      gender: 'FEMALE',
      alive: true,
    });

    expect(result).toBe(RegisterResult.VALID);
    expect(registry.registerVoter).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Ana',
        id: 100,
        age: 30,
        gender: Gender.FEMALE,
        alive: true,
      }),
    );
  });

  it('shouldThrowInvalidGenderExceptionForUnknownValue', () => {
    expect(() =>
      controller.register({
        name: 'Ana',
        id: 100,
        age: 30,
        gender: 'DESCONOCIDO',
        alive: true,
      }),
    ).toThrow(InvalidGenderException);
  });
});
