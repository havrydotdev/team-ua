import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';
import { ReplyUseCases } from 'src/use-cases/reply';
import { Extra } from '../types';
import { MsgKey } from 'src/types';

@Injectable()
export class I18nInterceptor implements NestInterceptor {
  constructor(private readonly replyUseCases: ReplyUseCases) {}

  intercept(ctx: ExecutionContext, next: CallHandler) {
    const telegrafCtx = ctx.getArgByIndex(0);

    return next.handle().pipe(
      map((data) => {
        return typeof data === 'string'
          ? this.replyUseCases.replyI18n(telegrafCtx, data as MsgKey)
          : this.replyUseCases.replyI18n(
              telegrafCtx,
              ...(data as [MsgKey, Extra]),
            );
      }),
    );
  }
}
