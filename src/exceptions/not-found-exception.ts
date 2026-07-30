import AppError from './app-error';
import {HTTPResponse} from '../response';

export default class NotFoundException extends AppError {
  constructor(message = 'Resource not found') {
    super(message, HTTPResponse.NOT_FOUND);
  }
}
