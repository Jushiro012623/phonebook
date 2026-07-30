export default class AppError extends Error {
  public readonly status: number;
  public readonly details: Record<string, unknown>;
  public readonly title?: string | undefined;

  constructor(
    message: string,
    status: number,
    details: Record<string, unknown> = {},
    title?: string
  ) {
    super(message);

    this.name = this.constructor.name;
    this.status = status;
    this.details = details;
    this.title = title;

    Error.captureStackTrace?.(this, this.constructor);
  }
}
