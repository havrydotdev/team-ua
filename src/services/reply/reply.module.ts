import { Module } from '@nestjs/common';
import { TelegrafReplyModule } from 'src/frameworks/reply/telegraf';

@Module({
  imports: [TelegrafReplyModule],
  exports: [TelegrafReplyModule],
})
export class ReplyModule {}
