import { Module } from '@nestjs/common';
import { AwsFileModule } from 'src/frameworks/file/aws';

@Module({
  imports: [AwsFileModule],
  exports: [AwsFileModule],
})
export class FileModule {}
