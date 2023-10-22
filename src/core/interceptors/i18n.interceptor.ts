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
        switch (typeof data) {
          case 'string':
            this.replyUseCases.replyI18n(telegrafCtx, data as MsgKey);
            break;
          case 'undefined':
            break;
          default:
            switch (typeof data[0]) {
              case 'string':
                this.replyUseCases.replyI18n(
                  telegrafCtx,
                  data[0] as MsgKey,
                  data[1] as Extra,
                );
                break;
              default:
                for (let i = 0; i < data[0].length; i++) {
                  this.replyUseCases.replyI18n(
                    telegrafCtx,
                    data[0][i] as MsgKey,
                    data[1][i] as Extra,
                  );
                }
                break;
            }
        }
      }),
    );
  }
}
