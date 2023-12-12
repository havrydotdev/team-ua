import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerOptions } from '@nestjs/throttler';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { MessageContext } from 'src/types';

import { BotException } from '../errors';

@Injectable()
export class TelegrafThrottlerGuard extends ThrottlerGuard {
  protected async handleRequest(
    context: ExecutionContext,
    limit: number,
    ttl: number,
    throttler: ThrottlerOptions,
  ): Promise<boolean> {
    const tgExecutionContext = TelegrafExecutionContext.create(context);
    const tgCtx = tgExecutionContext.getContext<MessageContext>();
    const key = this.generateKey(
      context,
      tgCtx.message.from.id.toString(),
      throttler.name,
    );
    const { totalHits } = await this.storageService.increment(key, ttl);

    if (totalHits > limit) {
      throw new BotException();
    }

    return true;
  }
}
