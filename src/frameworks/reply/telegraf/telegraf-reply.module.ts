import { Module } from '@nestjs/common';
import { IReplyService } from 'src/core/abstracts';

import { TelegrafReplyService } from './telegraf-reply.service';

@Module({
  exports: [IReplyService],
  providers: [
    {
      provide: IReplyService,
      useClass: TelegrafReplyService,
    },
  ],
})
export class TelegrafReplyModule {}
