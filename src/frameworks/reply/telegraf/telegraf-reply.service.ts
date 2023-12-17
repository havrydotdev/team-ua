import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { IReplyService } from 'src/core/abstracts';
import {
  MessageContext,
  SendPhotoArgs,
  SendTextArgs,
  SendTextReturnType,
} from 'src/types/telegraf';
import { Telegraf } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';

@Injectable()
class TelegrafReplyService implements IReplyService {
  constructor(@InjectBot() private bot: Telegraf<MessageContext>) {}

  sendMessage(...args: SendTextArgs): SendTextReturnType {
    return this.bot.telegram.sendMessage(...args);
  }

  sendPhoto(...args: SendPhotoArgs): Promise<Message.PhotoMessage> {
    return this.bot.telegram.sendPhoto(...args);
  }
}

export { TelegrafReplyService };
