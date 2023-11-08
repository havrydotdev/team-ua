import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IReportService } from 'src/core/abstracts';
import { Report, ReportsChannel } from 'src/core/entities';

import { TypeOrmReportService } from './typeorm-report.service';

@Module({
  exports: [IReportService],
  imports: [TypeOrmModule.forFeature([Report, ReportsChannel])],
  providers: [
    {
      provide: IReportService,
      useClass: TypeOrmReportService,
    },
  ],
})
export class TypeOrmReportModule {}
