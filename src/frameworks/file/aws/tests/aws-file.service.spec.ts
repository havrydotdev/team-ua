import { CompleteMultipartUploadCommandOutput, S3 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mocked } from 'jest-mock';
import { File } from 'src/core/entities';
import { BotException } from 'src/core/errors';
import { Repository } from 'typeorm';
import { AwsFileService } from '../aws-file.service';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test'),
}));

jest.mock('@aws-sdk/lib-storage', () => ({
  Upload: jest.fn(() => ({
    done: jest.fn(),
  })),
}));

describe('AwsFileService', () => {
  let service: AwsFileService;
  let configService: ConfigService;
  let fileRepo: Repository<File>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AwsFileService,
        {
          provide: ConfigService,
          useValue: createMock<ConfigService>({
            get: jest.fn(() => {
              return 'test';
            }),
          }),
        },
        {
          provide: 'S3_CLIENT',
          useValue: createMock<S3>(),
        },
        {
          provide: getRepositoryToken(File),
          useValue: createMock<Repository<File>>({
            insert: jest.fn().mockResolvedValue({
              identifiers: [{ id: 1 }],
            }),
          }),
        },
      ],
    }).compile();

    service = module.get<AwsFileService>(AwsFileService);
    configService = module.get<ConfigService>(ConfigService);
    fileRepo = module.get<Repository<File>>(getRepositoryToken(File));
  });

  describe('upload', () => {
    it('should upload the file to S3 and insert a new file into the database', async () => {
      const uploadMock = mocked(Upload);
      (uploadMock as any).mockImplementationOnce(() => ({
        done: jest.fn().mockResolvedValue(
          createMock<CompleteMultipartUploadCommandOutput>({
            Key: 'test',
            Location: 'test',
          }),
        ),
      }));
      const blob = Buffer.from('test');
      const filename = 'ok.txt';

      const result = await service.upload(blob, filename);

      expect(result).toEqual(1);
      expect(configService.get).toHaveBeenCalledWith('AWS_PUBLIC_BUCKET_NAME');
      expect(uploadMock).toHaveBeenCalledTimes(1);
      expect(fileRepo.insert).toHaveBeenCalledWith({
        key: 'test',
        url: 'test',
      });
    });

    it('should throw a BotException if the upload result is missing Key or Location', async () => {
      const uploadMock = mocked(Upload);
      (uploadMock as any).mockImplementationOnce(() => ({
        done: jest.fn().mockResolvedValue({}),
      }));
      const blob = Buffer.from('test');
      const filename = 'test.txt';

      await expect(service.upload(blob, filename)).rejects.toThrow(
        BotException,
      );
    });
  });
});
