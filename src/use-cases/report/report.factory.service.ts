import { Injectable } from '@nestjs/common';
import { CreateReportDto, CreateReportsChannelDto } from 'src/core/dtos';
import { Report, ReportsChannel } from 'src/core/entities';

@Injectable()
export class ReportFactoryService {
  createReport(dto: CreateReportDto) {
    return Report.create({
      description: dto.description,
      reporter: {
        id: dto.reporterId,
      },
      user: {
        id: dto.userId,
      },
    });
  }

  createReportsChannel(dto: CreateReportsChannelDto) {
    return ReportsChannel.create({
      ...dto,
    });
  }
}
