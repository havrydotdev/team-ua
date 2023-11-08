import { Module } from '@nestjs/common';
import { ProfileUseCasesModule } from 'src/use-cases/profile';

import { ProfileSubscriber } from './profile.subscriber';

@Module({
  imports: [ProfileUseCasesModule, ProfileUseCasesModule],
  providers: [ProfileSubscriber],
})
export class SubscribersModule {}
