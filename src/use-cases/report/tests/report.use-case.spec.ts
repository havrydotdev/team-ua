import { TestBed } from '@automock/jest';
import { createMock } from '@golevelup/ts-jest';
import { IReportService } from 'src/core/abstracts';
import { CreateReportDto, CreateReportsChannelDto } from 'src/core/dtos';
import { ReportsChannel } from 'src/core/entities';

import { ReportFactoryService } from '../report.factory.service';
import { ReportUseCases } from '../report.use-case';

describe('ReportUseCases', () => {
  let useCases: ReportUseCases;
  let reportService: jest.Mocked<IReportService>;
  let reportFactoryService: jest.Mocked<ReportFactoryService>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(ReportUseCases).compile();

    useCases = unit;
    // @ts-expect-error - abstract class
    reportService = unitRef.get(IReportService);
    reportFactoryService = unitRef.get(ReportFactoryService);
  });

  it('should create a report', async () => {
    const reportDto: CreateReportDto = {
      description: 'Test description',
      reporterId: 1,
      userId: 2,
    };

    await useCases.createReport(reportDto);

    expect(reportFactoryService.createReport).toHaveBeenCalledWith(reportDto);
    expect(reportService.createReport).toHaveBeenCalled();
  });

  it('should create a report channel', async () => {
    const channelDto: CreateReportsChannelDto = {
      id: 123,
    };

    await useCases.createReportChannel(channelDto);

    expect(reportFactoryService.createReportsChannel).toHaveBeenCalledWith(
      channelDto,
    );
    expect(reportService.createReportsChannel).toHaveBeenCalled();
  });

  it('should delete a report', async () => {
    await useCases.deleteReport(1);

    expect(reportService.deleteReport).toHaveBeenCalledWith(1);
  });

  it('should find a report by id', async () => {
    await useCases.findReportById(1);

    expect(reportService.findById).toHaveBeenCalledWith(1);
  });

  it('should find reports channel', async () => {
    const reportsChannel = createMock<ReportsChannel>();

    const findSpy = jest
      .spyOn(reportService, 'findReportsChannel')
      .mockResolvedValue(reportsChannel);

    const result = await useCases.findReportsChannel();

    expect(result).toEqual(reportsChannel);
    expect(findSpy).toHaveBeenCalled();
  });
});
