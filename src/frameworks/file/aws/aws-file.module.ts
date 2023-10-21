import { Module } from '@nestjs/common';
import { File, IFileService } from 'src/core';
import { AwsFileService } from './aws-file.service';
import { TypeOrmModule } from '@nestjs/typeorm';

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
