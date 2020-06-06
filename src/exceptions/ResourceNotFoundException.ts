import { HttpException } from '@nestjs/common';

export class ResourceNotFoundException extends HttpException {
  constructor(message: string) {
    super(message, 404);
  }
}
