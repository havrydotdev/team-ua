import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IGameService } from 'src/core/abstracts/game.abstract.service';
import { Game } from 'src/core/entities';
import { TypeOrmGameService } from './typeorm-game.service';

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
