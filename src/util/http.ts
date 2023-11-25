class CustomError extends Error {
  private readonly code: string;
  private readonly details: CustomError[] | null;

  constructor(
    code: string,
    message: string | null = null,
    details: CustomError[] | null = null
  ) {
    super(message || code);
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string, details: null | any[] = null) {
    super("BAD_REQUEST", message, details);
  }
}

export class InternalServerError extends CustomError {
  constructor(message: string, details: null | any[] = null) {
    super("INTERNAL_SERVER_ERROR", message, details);
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string, details: null | any[] = null) {
    super("NOT_FOUND", message, details);
  }
}

export class UserAlreadyExists extends CustomError {
  constructor(message: string, details: null | any[] = null) {
    super("USER_EXISTING", message, details);
  }
}

export class EmailAlreadyExists extends CustomError {
  constructor(message: string, details: null | any[] = null) {
    super("EMAIL_EXISTING", message, details);
  }
}

export class PasswordIsNotEqual extends CustomError {
  constructor(message: string, details: null | any[] = null) {
    super("PASSWORD_IS_NOT_EQUAL", message, details);
  }
}

export class EmailNotExists extends CustomError {
  constructor(message: string, details: null | any[] = null) {
    super("EMAIL_NOT_EXISTS", message, details);
  }
}
