import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TelegrafExecutionContext } from 'nestjs-telegraf';

export const UserProfile = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const tgCtx = TelegrafExecutionContext.create(ctx);

    const req = tgCtx.switchToHttp().getRequest();

    return req.profile;
  },
);
