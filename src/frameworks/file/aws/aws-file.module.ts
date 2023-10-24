import { Module } from '@nestjs/common';
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
  ],
  exports: [IFileService],
})
export class AwsFileModule {}
