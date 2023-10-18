import { Module } from '@nestjs/common';
import { ProfileModule } from 'src/services/profile/profile.module';
import { ProfileUseCases } from './profile.use-case';
import { ProfileFactoryService } from './profile-factory.service';

@Module({
  imports: [ProfileModule],
  providers: [ProfileUseCases, ProfileFactoryService],
  exports: [ProfileUseCases],
})
export class ProfileUseCasesModule {}
