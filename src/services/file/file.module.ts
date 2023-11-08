import { Module } from '@nestjs/common';
import { AwsFileModule } from 'src/frameworks/file/aws';

@Module({
  exports: [AwsFileModule],
  imports: [AwsFileModule],
})
export class FileModule {}
