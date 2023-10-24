import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { ClientConfiguration } from 'aws-sdk/clients/acm';
import { IFileService } from 'src/core/abstracts';
import { File } from 'src/core/entities';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

// TODO: migrate to @aws-sdk/client-s3
@Injectable()
export class AwsFileService implements IFileService {
  private readonly _s3Config: ClientConfiguration;

  constructor(
    @InjectRepository(File)
    private fileRepo: Repository<File>,
    private readonly configService: ConfigService,
  ) {
    this._s3Config = {
      accessKeyId: configService.get('AWS_ACCESS_KEY'),
      secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
      region: configService.get('AWS_REGION'),
      apiVersion: '2010-12-01',
    };
  }

  async upload(blob: Buffer, filename: string): Promise<number> {
    const _s3 = new S3(this._s3Config);
    const uploadResult = await _s3
      .upload({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Body: blob,
        Key: `${uuid()}-${filename}`,
      })
      .promise();

    const newFile = await this.fileRepo.insert({
      key: uploadResult.Key,
      url: uploadResult.Location,
    });

    console.log(newFile);

    return newFile.identifiers[0].id as number;
  }
}
