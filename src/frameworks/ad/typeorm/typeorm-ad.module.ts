import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IAdService } from 'src/core/abstracts/ad.abstract.service';
import { Ad } from 'src/core/entities';

import { TypeOrmAdService } from './typeorm-ad.service';

@Module({
  exports: [IAdService],
  imports: [TypeOrmModule.forFeature([Ad])],
  providers: [
    {
      provide: IAdService,
      useClass: TypeOrmAdService,
    },
  ],
})
export class TypeOrmAdModule {}
