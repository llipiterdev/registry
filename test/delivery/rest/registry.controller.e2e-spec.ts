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
 * Pruebas de sistema (caja negra) equivalentes a RegistryControllerIT.java.
 * Usan supertest como cliente HTTP (equivalente a TestRestTemplate).
 */
describe('RegistryControllerIT (e2e)', () => {
  let app: INestApplication<App>;

  async function createApp(
    repositoryFactory: () => RegistryRepositoryPort = () => {
      const repo = new RegistryRepository(':memory:');
      repo.initSchema();
      return repo;
    },
  ): Promise<INestApplication<App>> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [RegistryController],
      providers: [
        {
          provide: REGISTRY_REPOSITORY_PORT,
          useFactory: repositoryFactory,
        },
        {
          provide: Registry,
          useFactory: (port: RegistryRepositoryPort) => new Registry(port),
          inject: [REGISTRY_REPOSITORY_PORT],
        },
      ],
    }).compile();

    const nestApp = moduleFixture.createNestApplication();
    await nestApp.init();
    return nestApp;
  }

  beforeEach(async () => {
    app = await createApp();
  });

  afterEach(async () => {
    await app.close();
  });

  /**
   * Propósito: validar registro exitoso vía HTTP (status 200, body VALID).
   */
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

  /**
   * Propósito: validar respuesta 400 ante entrada inconsistente (género inválido).
   */
  it('shouldReturn400WhenGenderIsInvalid', () => {
    return request(app.getHttpServer())
      .post('/register')
      .set('Content-Type', 'application/json')
      .send({
        name: 'Ana',
        id: 100,
        age: 30,
        gender: 'INVALIDO',
        alive: true,
      })
      .expect(400)
      .expect(/Género inválido/);
  });

  /**
   * Propósito: validar respuesta 500 ante fallo de persistencia simulado.
   */
  it('shouldReturn500WhenPersistenceFails', async () => {
    await app.close();

    app = await createApp(() => {
      const repo: RegistryRepositoryPort = {
        initSchema: jest.fn(),
        existsById: jest.fn().mockReturnValue(false),
        save: jest.fn().mockImplementation(() => {
          throw new Error('SQLITE_IOERR');
        }),
        findById: jest.fn(),
        deleteAll: jest.fn(),
      };
      return repo;
    });

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
      .expect(500)
      .expect(/Persistencia:/);
  });
});
