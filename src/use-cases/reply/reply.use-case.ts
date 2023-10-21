import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { IReplyService } from 'src/core/abstracts/reply.abstract.service';
import { MsgKey } from 'src/types';
import { Extra } from 'src/core/types';

@Injectable()
export class ReplyUseCases {
  constructor(private readonly replyService: IReplyService) {}

  async replyI18n(ctx: Context, key: MsgKey, params?: Extra) {
    await this.replyService.reply(ctx, key, params);
  }
}
