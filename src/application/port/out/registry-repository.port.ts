import { RegistryRecord } from '../../../infrastructure/persistence/registry-record.entity';

/**
 * Puerto de salida para persistencia de registros.
 * Define las operaciones necesarias para el caso de uso Registry.
 */
export interface RegistryRepositoryPort {
  /** Crea la tabla/estructura inicial (útil en pruebas con SQLite en memoria). */
  initSchema(): void;

  /** Verifica si un registro existe por ID. */
  existsById(id: number): boolean;

  /** Persiste un nuevo registro en la base de datos. */
  save(id: number, name: string, age: number, isAlive: boolean): void;

  /** Busca un registro por su ID. */
  findById(id: number): RegistryRecord | null;

  /** Borra todos los registros (útil para limpiar entre pruebas). */
  deleteAll(): void;
}

export const REGISTRY_REPOSITORY_PORT = Symbol('RegistryRepositoryPort');
