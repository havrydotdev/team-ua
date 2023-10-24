import { Module } from '@nestjs/common';
import { IReplyService } from 'src/core/abstracts';
import { TelegrafReplyService } from './telegraf-reply.service';

@Module({
  providers: [
    {
      provide: IReplyService,
      useClass: TelegrafReplyService,
    },
  ],
  exports: [IReplyService],
})
export class TelegrafReplyModule {}
