import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { MessageContext } from 'src/types';
import { UserUseCases } from 'src/use-cases/user';

@Injectable()
export class ContextInterceptor implements NestInterceptor {
  constructor(private readonly userUseCases: UserUseCases) {}

  async intercept(ctx: ExecutionContext, next: CallHandler) {
    const tgExecutionContext = TelegrafExecutionContext.create(ctx);
    const tgCtx = tgExecutionContext.getContext<MessageContext>();

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
