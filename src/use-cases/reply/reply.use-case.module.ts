import { Module } from '@nestjs/common';
import { ReplyModule } from 'src/services';
import { ReplyUseCases } from './reply.use-case';

@Module({
  imports: [ReplyModule],
  providers: [ReplyUseCases],
  exports: [ReplyUseCases],
})
export class ReplyUseCasesModule {}
