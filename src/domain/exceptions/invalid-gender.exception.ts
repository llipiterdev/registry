export class InvalidGenderException extends Error {
  constructor(public readonly gender: string) {
    super(`Género inválido: ${gender}`);
    this.name = 'InvalidGenderException';
  }
}
