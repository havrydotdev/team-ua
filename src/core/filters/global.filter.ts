import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { MessageContext, MsgKey } from 'src/types';
import { ReplyUseCases } from 'src/use-cases/reply';
import { BotException } from '../errors';

@Catch()
export class GlobalFilter implements ExceptionFilter {
  constructor(private readonly replyUseCases: ReplyUseCases) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.getArgByIndex(0) as MessageContext;
    let message: MsgKey = 'errors.unknown';

    if (exception instanceof BotException) {
      message = exception.message as MsgKey;
    }

    this.replyUseCases.replyI18n(ctx, message);
  }
}
