import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from 'src/core';
import { TypeOrmGameService } from './typeorm-game.service';
import { IGameService } from 'src/core/abstracts/game.abstract.service';

@Module({
  imports: [TypeOrmModule.forFeature([Game])],
  providers: [
    {
      provide: IGameService,
      useClass: TypeOrmGameService,
    },
  ],
  exports: [IGameService],
})
export class TypeOrmGameModule {}
