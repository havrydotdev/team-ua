import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IProfileService } from 'src/core/abstracts';
import { Profile } from 'src/core/entities';
import { TypeOrmProfileService } from './typeorm-profile.service';

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
