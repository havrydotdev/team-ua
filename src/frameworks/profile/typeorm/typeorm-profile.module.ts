import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IProfileService } from 'src/core/abstracts';
import { Profile, User } from 'src/core/entities';

import { TypeOrmProfileService } from './typeorm-profile.service';

@Module({
  exports: [IProfileService],
  imports: [TypeOrmModule.forFeature([Profile, User])],
  providers: [
    {
      provide: IProfileService,
      useClass: TypeOrmProfileService,
    },
  ],
})
export class TypeOrmProfileModule {}
