import { Injectable } from '@nestjs/common';
import { IReportService } from 'src/core/abstracts';
import { CreateReportDto, CreateReportsChannelDto } from 'src/core/dtos';

import { ReportFactoryService } from './report.factory.service';

@Injectable()
export class ReportUseCases {
  constructor(
    private readonly reportService: IReportService,
    private readonly reportFactoryService: ReportFactoryService,
  ) {}

  async createReport(dto: CreateReportDto) {
    const report = this.reportFactoryService.createReport(dto);

    return this.reportService.createReport(report);
  }

  async createReportChannel(dto: CreateReportsChannelDto) {
    const reportChannel = this.reportFactoryService.createReportsChannel(dto);

    return this.reportService.createReportsChannel(reportChannel);
  }

  async deleteReport(id: number) {
    return this.reportService.deleteReport(id);
  }

  async findReportById(id: number) {
    return this.reportService.findById(id);
  }

  async findReportsChannel() {
    return this.reportService.findReportsChannel();
  }
}
