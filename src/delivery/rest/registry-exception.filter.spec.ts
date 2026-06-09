import { ArgumentsHost, BadRequestException } from '@nestjs/common';
import { InvalidGenderException } from '../../domain/exceptions/invalid-gender.exception';
import { RegistryPersistenceException } from '../../domain/exceptions/registry-persistence.exception';
import { RegistryExceptionFilter } from './registry-exception.filter';

describe('RegistryExceptionFilter', () => {
  const filter = new RegistryExceptionFilter();

  function createHost(): {
    host: ArgumentsHost;
    statusMock: jest.Mock;
    typeMock: jest.Mock;
    sendMock: jest.Mock;
  } {
    const sendMock = jest.fn();
    const typeMock = jest.fn();
    const statusMock = jest.fn();
    const response = { status: statusMock, type: typeMock, send: sendMock };
    statusMock.mockReturnValue(response);
    typeMock.mockReturnValue(response);

    const host = {
      switchToHttp: () => ({
        getResponse: () => response,
      }),
    } as unknown as ArgumentsHost;

    return { host, statusMock, typeMock, sendMock };
  }

  it('shouldReturn500ForPersistenceException', () => {
    const { host, statusMock, sendMock } = createHost();
    const exception = new RegistryPersistenceException('Error', 'fallo de BD');

    filter.catch(exception, host);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(sendMock).toHaveBeenCalledWith('Persistencia: Error - fallo de BD');
  });

  it('shouldReturn400ForInvalidGenderException', () => {
    const { host, statusMock, sendMock } = createHost();
    const exception = new InvalidGenderException('XYZ');

    filter.catch(exception, host);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(sendMock).toHaveBeenCalledWith('Género inválido: XYZ');
  });

  it('shouldReturn400ForBadRequestExceptionWithArrayMessage', () => {
    const { host, statusMock, sendMock } = createHost();
    const exception = new BadRequestException(['campo1', 'campo2']);

    filter.catch(exception, host);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(sendMock).toHaveBeenCalledWith('campo1, campo2');
  });
});
