export class RegistryPersistenceException extends Error {
  constructor(
    public readonly causeType: string,
    causeMessage: string,
    public readonly cause?: Error,
  ) {
    super(`Persistencia: ${causeType} - ${causeMessage}`);
    this.name = 'RegistryPersistenceException';
  }
}
