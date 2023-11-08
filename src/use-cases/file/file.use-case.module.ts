import { Module } from '@nestjs/common';
import { FileModule } from 'src/services/file/file.module';

import { FileUseCases } from './file.use-case.service';

@Module({
  exports: [FileUseCases],
  imports: [FileModule],
  providers: [FileUseCases],
})
export class FileUseCasesModule {}
