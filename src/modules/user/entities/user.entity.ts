export class User {
  public readonly id: string;
  public readonly name: string;
  public readonly email: string;
  private password: string;

  constructor(params: {
    name: string;
    email: string;
    password: string;
    id?: string;
  }) {
    const { name, email, password, id } = params;

    this.id = id || '';
    this.name = name;
    this.email = email;
    this.password = password;
  }

  public setPassword(params: { encryptedPassword: string }): void {
    const { encryptedPassword } = params;

    this.password = encryptedPassword;
  }

  public validatePassword(params: {
    rawPassword: string;
    compareFn: (raw: string, encrypted: string) => boolean;
  }): boolean {
    const { rawPassword, compareFn } = params;

    return compareFn(rawPassword, this.password);
  }
}
