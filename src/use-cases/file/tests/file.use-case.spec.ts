import { Test, TestingModule } from '@nestjs/testing';
import { FileUseCases } from '../file.use-case.service';
import { IFileService } from 'src/core';

describe('FileUseCases', () => {
  let useCases: FileUseCases;
  let fileService: IFileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileUseCases,
        {
          provide: IFileService,
          useValue: {
            upload: jest.fn().mockResolvedValue(1),
          },
        },
      ],
    }).compile();

    useCases = module.get<FileUseCases>(FileUseCases);
    fileService = module.get<IFileService>(IFileService);
  });

  describe('upload', () => {
    it('should call upload on the file service and return the result', async () => {
      const file = Buffer.from('test');
      const fileName = 'test.txt';

      const result = await useCases.upload(file, fileName);

      expect(result).toEqual(1);
      expect(fileService.upload).toHaveBeenCalledWith(file, fileName);
    });
  });
});
