export class User {
  public readonly id: string;
  public readonly name: string;
  public readonly email: string;
  private password: string;

  constructor(name: string, email: string, password: string, id?: string) {
    this.id = id || '';
    this.name = name;
    this.email = email;
    this.password = password;
  }

  public setPassword(encryptedPassword: string): void {
    this.password = encryptedPassword;
  }

  public validatePassword(
    rawPassword: string,
    compareFn: (raw: string, encrypted: string) => boolean,
  ): boolean {
    return compareFn(rawPassword, this.password);
  }
}
