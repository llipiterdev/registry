import { Gender } from './gender.enum';

export class Person {
  constructor(
    public readonly name: string,
    public readonly id: number,
    public readonly age: number,
    public readonly gender: Gender,
    public readonly alive: boolean,
  ) {}
}
