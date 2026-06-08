import { Provider } from '@nestjs/common';
import {
  REGISTRY_REPOSITORY_PORT,
  RegistryRepositoryPort,
} from '../application/port/out/registry-repository.port';
import { Registry } from '../application/usecase/registry.usecase';
import { RegistryRepository } from '../infrastructure/persistence/registry.repository';

export const registryProviders: Provider[] = [
  {
    provide: REGISTRY_REPOSITORY_PORT,
    useFactory: (): RegistryRepositoryPort => {
      const repo = new RegistryRepository(':memory:');
      repo.initSchema();
      return repo;
    },
  },
  {
    provide: Registry,
    useFactory: (port: RegistryRepositoryPort) => new Registry(port),
    inject: [REGISTRY_REPOSITORY_PORT],
  },
];
