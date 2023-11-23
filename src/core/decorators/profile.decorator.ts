import { createParamDecorator } from '@nestjs/common';

export const UserProfile = createParamDecorator(
  (data: unknown, req) => req.user,
);
