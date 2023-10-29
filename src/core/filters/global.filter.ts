import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { TelegrafArgumentsHost } from 'nestjs-telegraf';
import { MsgKey } from 'src/types';
import { ReplyUseCases } from 'src/use-cases/reply';
import { Context } from 'telegraf';
import { BotException } from '../errors';

@Catch()
export class GlobalFilter implements ExceptionFilter {
  constructor(private readonly replyUseCases: ReplyUseCases) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const telegrafHost = TelegrafArgumentsHost.create(host);
    const ctx = telegrafHost.getContext<Context>();

    let message: MsgKey = 'errors.unknown';

    if (exception instanceof BotException) {
      message = exception.message as MsgKey;
    }

    await this.replyUseCases.replyI18n(ctx, message);
  }
}
