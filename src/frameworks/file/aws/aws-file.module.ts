import { S3, S3ClientConfig } from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IFileService } from 'src/core/abstracts';
import { File } from 'src/core/entities';
import { AwsFileService } from './aws-file.service';

@Module({
  imports: [TypeOrmModule.forFeature([File])],
  providers: [
    {
      provide: IFileService,
      useClass: AwsFileService,
    },
    {
      provide: 'S3_CLIENT',
      useFactory: async (
        configService: ConfigService,
      ): Promise<S3ClientConfig> => {
        return new S3({
          region: configService.get('AWS_REGION'),
          credentials: {
            accessKeyId: configService.get('AWS_ACCESS_KEY'),
            secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [IFileService],
})
export class AwsFileModule {}
