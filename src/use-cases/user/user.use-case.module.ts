import { Module } from '@nestjs/common';
import { UserModule } from 'src/services';

import { UserFactoryService } from './user-factory.service';
import { UserUseCases } from './user.use-case';

@Module({
  exports: [UserFactoryService, UserUseCases],
  imports: [UserModule],
  providers: [UserFactoryService, UserUseCases],
})
export class UserUseCasesModule {}
