export class BaseException extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly errorCode: string,
    message: string
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

export class NotFoundException extends BaseException {
  constructor(message: string = 'Resource not found') {
    super(404, 'NOT_FOUND', message);
  }
}

export class UnauthorizedException extends BaseException {
  constructor(message: string = 'Unauthorized') {
    super(401, 'UNAUTHORIZED', message);
  }
}

export class ForbiddenException extends BaseException {
  constructor(message: string = 'Forbidden') {
    super(403, 'FORBIDDEN', message);
  }
}

export class ValidationException extends BaseException {
  constructor(message: string, public readonly details?: any) {
    super(400, 'VALIDATION_FAILED', message);
  }
}

export class BusinessRuleException extends BaseException {
  constructor(errorCode: string, message: string) {
    super(422, errorCode, message);
  }
}

export class ConflictException extends BaseException {
  constructor(message: string) {
    super(409, 'CONFLICT', message);
  }
}
