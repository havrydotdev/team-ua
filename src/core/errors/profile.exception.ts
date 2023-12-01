import { HttpException } from '@nestjs/common';

class ProfileException extends HttpException {
  constructor() {
    super('Profile is undefined', 401);
  }
}

export { ProfileException };
