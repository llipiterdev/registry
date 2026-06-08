import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import {
  REGISTRY_REPOSITORY_PORT,
  RegistryRepositoryPort,
} from '../../../src/application/port/out/registry-repository.port';
import { Registry } from '../../../src/application/usecase/registry.usecase';
import { RegistryController } from '../../../src/delivery/rest/registry.controller';
import { RegistryRepository } from '../../../src/infrastructure/persistence/registry.repository';

/**
 * Prueba de sistema (caja negra) equivalente a RegistryControllerIT.java.
 * Valida el endpoint POST /register sin depender de la implementación interna.
 */
describe('RegistryControllerIT (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [RegistryController],
      providers: [
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
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('shouldRegisterValidPerson', () => {
    return request(app.getHttpServer())
      .post('/register')
      .set('Content-Type', 'application/json')
      .send({
        name: 'Ana',
        id: 100,
        age: 30,
        gender: 'FEMALE',
        alive: true,
      })
      .expect(200)
      .expect('VALID');
  });
});
