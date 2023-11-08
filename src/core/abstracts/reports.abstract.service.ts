import { Report, ReportsChannel } from '../entities';

abstract class IReportService {
  abstract createReport(report: Report): Promise<Report>;

  abstract createReportsChannel(
    reportChannel: ReportsChannel,
  ): Promise<ReportsChannel>;

  abstract deleteReport(id: number): Promise<void>;

  abstract findById(id: number): Promise<Report>;

  abstract findReportsChannel(): Promise<ReportsChannel>;
}

export { IReportService };
