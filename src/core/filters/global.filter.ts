import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { TelegrafArgumentsHost } from 'nestjs-telegraf';
import { MessageContext, MsgKey } from 'src/types';
import { ReplyUseCases } from 'src/use-cases/reply';

import { NEXT_WIZARD_ID } from '../constants';

@Catch()
export class UnexpectedExceptionFilter implements ExceptionFilter {
  constructor(private readonly replyUseCases: ReplyUseCases) {}

  async catch(exception: Error, host: ArgumentsHost) {
    const telegrafHost = TelegrafArgumentsHost.create(host);
    const ctx = telegrafHost.getContext<MessageContext>();

    console.error(exception.message);

    if (ctx.scene.current) {
      ctx.scene.leave();

      ctx.scene.enter(NEXT_WIZARD_ID);
    }

    const message: MsgKey = 'errors.unknown';

    await this.replyUseCases.replyI18n(ctx, message);
  }
}
