import { Module } from '@nestjs/common';
import { ReportModule } from 'src/services/report/report.module';

import { ReportFactoryService } from './report.factory.service';
import { ReportUseCases } from './report.use-case';

@Module({
  exports: [ReportUseCases],
  imports: [ReportModule],
  providers: [ReportFactoryService, ReportUseCases],
})
export class ReportUseCasesModule {}
