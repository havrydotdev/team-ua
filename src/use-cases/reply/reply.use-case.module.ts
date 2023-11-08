import { Module } from '@nestjs/common';
import { ReplyModule } from 'src/services';
import { ReportModule } from 'src/services/report/report.module';

import { ReplyUseCases } from './reply.use-case';

@Module({
  exports: [ReplyUseCases],
  imports: [ReplyModule, ReportModule],
  providers: [ReplyUseCases],
})
export class ReplyUseCasesModule {}
