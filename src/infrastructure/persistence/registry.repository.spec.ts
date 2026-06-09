import { RegistryRepository } from './registry.repository';

describe('RegistryRepository', () => {
  let repo: RegistryRepository;

  beforeEach(() => {
    repo = new RegistryRepository(':memory:');
    repo.initSchema();
    repo.deleteAll();
  });

  it('shouldPersistAndFindRecord', () => {
    repo.save(1, 'Ana', 30, true);

    expect(repo.existsById(1)).toBe(true);

    const record = repo.findById(1);
    expect(record).toEqual(
      expect.objectContaining({
        id: 1,
        name: 'Ana',
        age: 30,
        isAlive: true,
      }),
    );
  });

  it('shouldReturnNullWhenRecordDoesNotExist', () => {
    expect(repo.findById(999)).toBeNull();
  });
});
