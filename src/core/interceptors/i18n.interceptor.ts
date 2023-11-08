import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { map } from 'rxjs';
import { Extra, MessageContext, MsgKey } from 'src/types';
import { ReplyUseCases } from 'src/use-cases/reply';

@Injectable()
export class I18nInterceptor implements NestInterceptor {
  private readonly logger: Logger = new Logger(I18nInterceptor.name);

  constructor(private readonly replyUseCases: ReplyUseCases) {}

  async intercept(ctx: ExecutionContext, next: CallHandler) {
    const tgExecutionContext = TelegrafExecutionContext.create(ctx);
    const tgCtx = tgExecutionContext.getContext<MessageContext>();

    this.logger.log(`Update from ${tgCtx.from.username}: ${tgCtx.updateType}`);

    return next.handle().pipe(
      map(async (data) => {
        switch (typeof data) {
          case 'string':
            await this.replyUseCases.replyI18n(tgCtx, data as MsgKey);
            break;

          case 'undefined':
            break;

          default:
            switch (typeof data[0]) {
              case 'string':
                await this.replyUseCases.replyI18n(
                  tgCtx,
                  data[0] as MsgKey,
                  data[1] as Extra,
                );
                break;

              default:
                for (let i = 0; i < data.length; i++) {
                  await this.replyUseCases.replyI18n(
                    tgCtx,
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
