import Database from 'better-sqlite3';
import { RegistryRepositoryPort } from '../../application/port/out/registry-repository.port';
import { RegistryRecord } from './registry-record.entity';

export class RegistryRepository implements RegistryRepositoryPort {
  private readonly db: Database.Database;

  constructor(databasePath: string = ':memory:') {
    this.db = new Database(databasePath);
  }

  initSchema(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS registry (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        is_alive INTEGER NOT NULL
      );
    `);
  }

  existsById(id: number): boolean {
    const row = this.db
      .prepare('SELECT 1 FROM registry WHERE id = ?')
      .get(id);
    return row !== undefined;
  }

  save(id: number, name: string, age: number, isAlive: boolean): void {
    const insert = this.db.prepare(
      'INSERT INTO registry(id, name, age, is_alive) VALUES(?, ?, ?, ?)',
    );

    const transaction = this.db.transaction(() => {
      insert.run(id, name, age, isAlive ? 1 : 0);
    });

    transaction();
  }

  findById(id: number): RegistryRecord | null {
    const row = this.db
      .prepare('SELECT id, name, age, is_alive FROM registry WHERE id = ?')
      .get(id) as
      | { id: number; name: string; age: number; is_alive: number }
      | undefined;

    if (!row) {
      return null;
    }

    return new RegistryRecord(row.id, row.name, row.age, row.is_alive === 1);
  }

  deleteAll(): void {
    this.db.exec('DELETE FROM registry');
  }
}
