import AppError from './app-error';
import {HTTPResponse} from '../response';

export default class ValidationException extends AppError {
  constructor(
    message = 'Validation failed',
    errors: Record<string, unknown> = {}
  ) {
    super(
      message,
      HTTPResponse.UNPROCESSABLE_ENTITY,
      {errors}
    );
  }
}
