import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { TelegrafArgumentsHost } from 'nestjs-telegraf';
import { MessageContext, MsgKey } from 'src/types';
import { ReplyUseCases } from 'src/use-cases/reply';

@Catch()
export class UnexpectedExceptionFilter implements ExceptionFilter {
  constructor(private readonly replyUseCases: ReplyUseCases) {}

  async catch(_exception: Error, host: ArgumentsHost) {
    const telegrafHost = TelegrafArgumentsHost.create(host);
    const ctx = telegrafHost.getContext<MessageContext>();

    const message: MsgKey = 'errors.unknown';

    await this.replyUseCases.replyI18n(ctx, message);
  }
}
