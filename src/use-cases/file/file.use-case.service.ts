import { Injectable } from '@nestjs/common';
import { IFileService } from 'src/core/abstracts';

@Injectable()
export class FileUseCases {
  constructor(private readonly fileService: IFileService) {}

  async upload(file: Buffer, fileName: string): Promise<number> {
    return this.fileService.upload(file, fileName);
  }
}
