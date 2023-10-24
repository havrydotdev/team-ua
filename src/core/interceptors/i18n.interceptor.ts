import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';
import { MsgKey } from 'src/types';
import { ReplyUseCases } from 'src/use-cases/reply';
import { Extra } from '../types';

@Injectable()
export class I18nInterceptor implements NestInterceptor {
  constructor(private readonly replyUseCases: ReplyUseCases) {}

  intercept(ctx: ExecutionContext, next: CallHandler) {
    const telegrafCtx = ctx.getArgByIndex(0);

    return next.handle().pipe(
      map(async (data) => {
        switch (typeof data) {
          case 'string':
            await this.replyUseCases.replyI18n(telegrafCtx, data as MsgKey);
            break;

          case 'undefined':
            break;

          default:
            switch (typeof data[0]) {
              case 'string':
                await this.replyUseCases.replyI18n(
                  telegrafCtx,
                  data[0] as MsgKey,
                  data[1] as Extra,
                );
                break;

              default:
                for (let i = 0; i < data.length; i++) {
                  await this.replyUseCases.replyI18n(
                    telegrafCtx,
                    data[i][0] as MsgKey,
                    data[i][1] as Extra,
                  );
                }
                break;
            }
        }
      }),
    );
  }
}
