// Todo: Validate what status nestjs uses for validation, would prefer UNPROCESSABLE_ENTITY
import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidResourceException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
