export enum ResultStatus {
  SUCCESS = 'success',
  FAILURE = 'failure',
}

export class Result<T> {
  public status: ResultStatus;
  private error?: string;
  private value?: T;

  private constructor(status: ResultStatus, error?: string, value?: T) {
    this.status = status;
    this.error = error;
    this.value = value;
  }

  public static ok<U>(value: U): Result<U> {
    return new Result<U>(ResultStatus.SUCCESS, undefined, value);
  }

  public static fail<U>(error: string): Result<U> {
    return new Result<U>(ResultStatus.FAILURE, error);
  }

  public getValue(): T | undefined {
    return this.value;
  }

  public getError(): string | undefined {
    return this.error;
  }
}
