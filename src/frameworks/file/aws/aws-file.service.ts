import { CompleteMultipartUploadCommandOutput, S3 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { IFileService } from 'src/core/abstracts';
import { File } from 'src/core/entities';
import { BotException } from 'src/core/errors';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AwsFileService implements IFileService {
  constructor(
    @InjectRepository(File)
    private fileRepo: Repository<File>,
    @Inject('S3_CLIENT') private readonly s3Client: S3,
    private readonly configService: ConfigService,
  ) {}

  async upload(blob: Buffer, filename: string): Promise<number> {
    const uploadResult = (await new Upload({
      client: this.s3Client,
      params: {
        Body: blob,
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Key: `f-${uuid()}-${filename}.jpg`,
      },
    }).done()) as CompleteMultipartUploadCommandOutput;

    if (!(uploadResult as any).Key || !(uploadResult as any).Location) {
      throw new BotException();
    }

    const newFile = await this.fileRepo.insert({
      key: uploadResult.Key,
      url: uploadResult.Location,
    });

    return newFile.identifiers[0].id as number;
  }
}
