import { Module } from '@nestjs/common';
import { UserFactoryService } from './user-factory.service';
import { UserUseCases } from './user.use-case';
import { UserModule } from 'src/services';

@Module({
  imports: [UserModule],
  providers: [UserFactoryService, UserUseCases],
  exports: [UserFactoryService, UserUseCases],
})
export class UserUseCaseModule {}
