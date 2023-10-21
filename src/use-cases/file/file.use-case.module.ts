import { Module } from '@nestjs/common';
import { FileUseCases } from './file.use-case.service';
import { FileModule } from 'src/services/file/file.module';

@Module({
  imports: [FileModule],
  providers: [FileUseCases],
  exports: [FileUseCases],
})
export class FileUseCasesModule {}
