import { Injectable } from '@nestjs/common';
import { Context } from 'src/core';
import { IReplyService } from 'src/core/abstracts/reply.abstract.service';
import {
  ParseMode,
  MessageEntity,
  InlineKeyboardMarkup,
  ReplyKeyboardMarkup,
  ReplyKeyboardRemove,
  ForceReply,
} from 'telegraf/typings/core/types/typegram';
import { FmtString } from 'telegraf/typings/format';

@Injectable()
class TelegrafReplyService implements IReplyService {
  async sendMessage(
    ctx: Context,
    text: string | FmtString,
    extra?: Omit<
      {
        chat_id: string | number;
        message_thread_id?: number;
        text: string;
        parse_mode?: ParseMode;
        entities?: MessageEntity[];
        disable_web_page_preview?: boolean;
        disable_notification?: boolean;
        protect_content?: boolean;
        reply_to_message_id?: number;
        allow_sending_without_reply?: boolean;
        reply_markup?:
          | InlineKeyboardMarkup
          | ReplyKeyboardMarkup
          | ReplyKeyboardRemove
          | ForceReply;
      },
      'chat_id' | 'text'
    >,
  ): Promise<void> {
    await ctx.reply(text, extra);
  }
}

export { TelegrafReplyService };
