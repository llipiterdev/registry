import {
  Body,
  Controller,
  Header,
  HttpCode,
  Post,
  UseFilters,
} from '@nestjs/common';
import { Registry } from '../../application/usecase/registry.usecase';
import { InvalidGenderException } from '../../domain/exceptions/invalid-gender.exception';
import { Gender } from '../../domain/model/gender.enum';
import { Person } from '../../domain/model/person.entity';
import { PersonDto } from '../../domain/model/rq/person.dto';
import { RegistryExceptionFilter } from './registry-exception.filter';

@Controller('register')
@UseFilters(RegistryExceptionFilter)
export class RegistryController {
  constructor(private readonly registry: Registry) {}

  @Post()
  @HttpCode(200)
  @Header('Content-Type', 'text/plain')
  register(@Body() dto: PersonDto): string {
    const person = new Person(
      dto.name,
      dto.id,
      dto.age,
      this.parseGender(dto.gender),
      dto.alive,
    );

    return this.registry.registerVoter(person);
  }

  private parseGender(value: string): Gender {
    if (!value || !Object.values(Gender).includes(value as Gender)) {
      throw new InvalidGenderException(value ?? 'undefined');
    }
    return value as Gender;
  }
}
