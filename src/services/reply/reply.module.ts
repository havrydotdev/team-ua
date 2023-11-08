import { Module } from '@nestjs/common';
import { TelegrafReplyModule } from 'src/frameworks/reply/telegraf';

@Module({
  exports: [TelegrafReplyModule],
  imports: [TelegrafReplyModule],
})
export class ReplyModule {}
