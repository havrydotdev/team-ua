import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TelegrafExecutionContext } from 'nestjs-telegraf';

import { User } from '../entities';

export const ReqUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const tgCtx = TelegrafExecutionContext.create(ctx);

    const req = tgCtx.switchToHttp().getRequest();

    return req.user;
  },
);
