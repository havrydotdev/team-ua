import { Module } from '@nestjs/common';
import { ProfileModule } from 'src/services/profile/profile.module';

import { AdUseCasesModule } from '../ad';
import { ReplyUseCasesModule } from '../reply';
import { ProfileFactoryService } from './profile-factory.service';
import { ProfileUseCases } from './profile.use-case';

@Module({
  exports: [ProfileUseCases],
  imports: [ProfileModule, ReplyUseCasesModule, AdUseCasesModule],
  providers: [ProfileUseCases, ProfileFactoryService],
})
export class ProfileUseCasesModule {}
