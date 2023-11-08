import { Module } from '@nestjs/common';
import { TypeOrmReportModule } from 'src/frameworks/report/typeorm';

@Module({
  exports: [TypeOrmReportModule],
  imports: [TypeOrmReportModule],
})
export class ReportModule {}
