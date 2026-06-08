import { Injectable, Inject } from '@nestjs/common';
import { REGISTRY_REPOSITORY_PORT } from '../port/out/registry-repository.port';
import type { RegistryRepositoryPort } from '../port/out/registry-repository.port';
import { Person } from '../../domain/model/person.entity';
import { MIN_VOTER_AGE } from '../../domain/model/registry.constants';
import { RegisterResult } from '../../domain/model/register-result.enum';

@Injectable()
export class Registry {
  constructor(
    @Inject(REGISTRY_REPOSITORY_PORT)
    private readonly repo: RegistryRepositoryPort,
  ) {}

  registerVoter(person: Person | null): RegisterResult {
    if (person === null) {
      return RegisterResult.INVALID;
    }
    if (person.id <= 0) {
      return RegisterResult.INVALID;
    }
    if (!person.alive) {
      return RegisterResult.DEAD;
    }
    if (person.age < MIN_VOTER_AGE) {
      return RegisterResult.UNDERAGE;
    }

    try {
      if (this.repo.existsById(person.id)) {
        return RegisterResult.DUPLICATED;
      }
      this.repo.save(person.id, person.name, person.age, person.alive);
      return RegisterResult.VALID;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error);
      const type =
        error instanceof Error ? error.constructor.name : 'UnknownError';
      throw new Error(`Persistencia: ${type} - ${message}`);
    }
  }
}
