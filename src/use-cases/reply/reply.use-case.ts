import { Injectable } from '@nestjs/common';
import { IReplyService } from 'src/core/abstracts/reply.abstract.service';
import { Extra } from 'src/core/types';
import { MsgKey } from 'src/types';
import { Context } from 'telegraf';

@Injectable()
export class ReplyUseCases {
  constructor(private readonly replyService: IReplyService) {}

  async replyI18n(ctx: Context, key: MsgKey, params?: Extra) {
    await this.replyService.reply(ctx, key, params);
  }
}
