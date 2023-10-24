import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { File } from 'src/core/entities';
import { MockDatabaseModule } from 'src/services/mock-database/mock-database.module';
import { InsertResult, Repository } from 'typeorm';
import { AwsFileService } from '../aws-file.service';

describe('AwsFileService', () => {
  let service: AwsFileService;
  let fileRepo: Repository<File>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MockDatabaseModule, TypeOrmModule.forFeature([File])],
      providers: [
        AwsFileService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => {
              return 'test';
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AwsFileService>(AwsFileService);
    fileRepo = module.get<Repository<File>>(getRepositoryToken(File));
  });

  describe('upload', () => {
    it('should upload the blob to S3 and insert a new file into the database', async () => {
      const blob = Buffer.from('test');
      const filename = 'test.txt';
      const key = 'test-key';
      const uploadResult = { Key: key };

      jest.spyOn(S3.prototype, 'upload').mockReturnValue({
        promise: jest.fn().mockResolvedValue(uploadResult),
      } as unknown as S3.ManagedUpload);

      jest.spyOn(fileRepo, 'insert').mockResolvedValue({
        identifiers: [{ id: 1 }],
      } as unknown as InsertResult);

      const result = await service.upload(blob, filename);

      expect(result).toEqual(1);

      expect(S3.prototype.upload).toHaveBeenCalledWith({
        Bucket: 'test',
        Body: blob,
        Key: expect.stringContaining(filename),
      });

      expect(fileRepo.insert).toHaveBeenCalledWith({
        key,
      });
    });
  });
});
