import { Module } from '@nestjs/common';
import { ProfileModule } from 'src/services/profile/profile.module';
import { ProfileFactoryService } from './profile-factory.service';
import { ProfileUseCases } from './profile.use-case';

@Module({
  imports: [ProfileModule],
  providers: [ProfileUseCases, ProfileFactoryService],
  exports: [ProfileUseCases],
})
export class ProfileUseCasesModule {}
