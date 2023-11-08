import { Module } from '@nestjs/common';
import { AdModule } from 'src/services/ad/ad.module';

import { AdFactoryService } from './ad.factory.service';
import { AdUseCases } from './ad.use-case';

@Module({
  imports: [AdModule],
  providers: [AdFactoryService, AdUseCases],
})
export class AdUseCasesModule {}
