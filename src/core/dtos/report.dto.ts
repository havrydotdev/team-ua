import { partial } from '../utils';

class CreateReportDto {
  description: string;
  reporterId: number;
  userId: number;
}

class UpdateReportDto extends partial<Partial<CreateReportDto>>() {}

class CreateReportsChannelDto {
  id: number;
}

class UpdateReportsChannelDto extends CreateReportsChannelDto {}

export {
  CreateReportDto,
  CreateReportsChannelDto,
  UpdateReportDto,
  UpdateReportsChannelDto,
};
