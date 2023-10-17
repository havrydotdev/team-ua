import { Module } from '@nestjs/common';
import { IProfileService, Profile } from 'src/core';
import { TypeOrmProfileService } from './typeorm-profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Profile])],
  exports: [IProfileService],
  providers: [
    {
      provide: IProfileService,
      useClass: TypeOrmProfileService,
    },
  ],
})
export class TypeOrmProfileModule {}
