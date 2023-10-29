import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { MessageContext } from 'src/types';
import { UserUseCases } from 'src/use-cases/user';

@Injectable()
export class ContextInterceptor implements NestInterceptor {
  constructor(private readonly userUseCases: UserUseCases) {}

  async intercept(ctx: ExecutionContext, next: CallHandler) {
    const tgCtx = ctx.getArgByIndex(0) as MessageContext;
    if (!tgCtx.session.user) {
      const user = await this.userUseCases.findById(tgCtx.from.id);

      if (user) {
        tgCtx.session.user = user;
      } else {
        tgCtx.session.user = await this.userUseCases.create({
          id: tgCtx.from.id,
        });
      }
    }

    return next.handle();
  }
}
