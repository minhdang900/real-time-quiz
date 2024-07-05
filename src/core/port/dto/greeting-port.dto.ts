export class GreetingPortDto {
  msg: string;

  constructor(init?: Partial<GreetingPortDto>) {
    Object.assign(this, init);
  }
}
