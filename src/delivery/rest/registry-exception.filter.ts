import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { InvalidGenderException } from '../../domain/exceptions/invalid-gender.exception';
import { RegistryPersistenceException } from '../../domain/exceptions/registry-persistence.exception';

@Catch(
  InvalidGenderException,
  RegistryPersistenceException,
  BadRequestException,
)
export class RegistryExceptionFilter implements ExceptionFilter {
  catch(
    exception:
      | InvalidGenderException
      | RegistryPersistenceException
      | BadRequestException,
    host: ArgumentsHost,
  ): void {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof RegistryPersistenceException) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).type('text/plain');
      response.send(exception.message);
      return;
    }

    const message =
      exception instanceof BadRequestException
        ? this.extractBadRequestMessage(exception)
        : exception.message;

    response.status(HttpStatus.BAD_REQUEST).type('text/plain');
    response.send(message);
  }

  private extractBadRequestMessage(exception: BadRequestException): string {
    const response = exception.getResponse();
    if (typeof response === 'string') {
      return response;
    }
    if (typeof response === 'object' && response !== null && 'message' in response) {
      const { message } = response as { message: string | string[] };
      return Array.isArray(message) ? message.join(', ') : message;
    }
    return exception.message;
  }
}
