import AppError from './app-error';
import {HTTPResponse} from '@app/response';

export default class ValidationException extends AppError {
  constructor(
    message = 'Validation failed',
    errors: { field: string; message: string[] }[] = []
  ) {
    super(
      message,
      HTTPResponse.UNPROCESSABLE_ENTITY,
      {errors}
    );
  }
}
