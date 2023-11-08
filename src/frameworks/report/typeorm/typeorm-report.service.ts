import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IReportService } from 'src/core/abstracts';
import { Report, ReportsChannel } from 'src/core/entities';
import { Not, Repository } from 'typeorm';

@Injectable()
export class TypeOrmReportService implements IReportService {
  constructor(
    @InjectRepository(Report) private readonly reportRepo: Repository<Report>,
    @InjectRepository(ReportsChannel)
    private readonly reportChannelRepo: Repository<ReportsChannel>,
  ) {}

  async createReport(report: Report): Promise<Report> {
    const res = await this.reportRepo.save(report);

    return this.findById(res.id);
  }

  async createReportsChannel(
    reportChannel: ReportsChannel,
  ): Promise<ReportsChannel> {
    await this.reportChannelRepo
      .createQueryBuilder('reports_channel')
      .delete()
      .where('true')
      .execute();

    return this.reportChannelRepo.save(reportChannel);
  }

  async deleteReport(id: number): Promise<void> {
    await this.reportRepo.delete(id);
  }

  async findById(id: number): Promise<Report> {
    return this.reportRepo.findOne({
      relations: {
        reporter: {
          profile: {
            games: true,
          },
        },
        user: {
          profile: {
            games: true,
          },
        },
      },
      where: {
        id,
      },
    });
  }

  async findReportsChannel(): Promise<ReportsChannel> {
    return this.reportChannelRepo.findOne({
      where: {
        id: Not(0),
      },
    });
  }
}
