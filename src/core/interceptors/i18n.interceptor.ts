import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { map } from 'rxjs';
import { MessageContext } from 'src/types';
import { ReplyUseCases } from 'src/use-cases/reply';

import { BotException } from '../errors';
import { isI18nKey, isMsgWithExtra, isMsgWithExtraArr } from '../utils';

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
        switch (true) {
          case typeof data === 'undefined':
            break;

          case isI18nKey(data):
            await this.replyUseCases.replyI18n(tgCtx.chat.id, data);
            break;

          case isMsgWithExtra(data):
            await this.replyUseCases.replyI18n(tgCtx.chat.id, data[0], data[1]);
            break;

          case isMsgWithExtraArr(data):
            for (let i = 0; i < data.length; i++) {
              await this.replyUseCases.replyI18n(
                tgCtx.chat.id,
                data[i][0],
                data[i][1],
              );
            }
            break;

          default:
            throw new BotException('errors.unknown');
        }
      }),
    );
  }
}
