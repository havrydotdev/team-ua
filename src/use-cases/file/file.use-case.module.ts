import { Module } from '@nestjs/common';
import { FileModule } from 'src/services/file/file.module';
import { FileUseCases } from './file.use-case.service';

@Module({
  imports: [FileModule],
  providers: [FileUseCases],
  exports: [FileUseCases],
})
export class FileUseCasesModule {}
