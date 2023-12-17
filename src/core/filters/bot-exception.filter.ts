import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { TelegrafArgumentsHost } from 'nestjs-telegraf';
import { MessageContext, MsgKey } from 'src/types';
import { ReplyUseCases } from 'src/use-cases/reply';

import { BotException } from '../errors';
@Catch(BotException)
export class BotExceptionFilter implements ExceptionFilter {
  constructor(private readonly replyUseCases: ReplyUseCases) {}

  async catch(exception: BotException, host: ArgumentsHost) {
    const telegrafHost = TelegrafArgumentsHost.create(host);
    const ctx = telegrafHost.getContext<MessageContext>();

    await this.replyUseCases.replyI18n(
      ctx.chat.id,
      exception.message as MsgKey,
    );
  }
}
