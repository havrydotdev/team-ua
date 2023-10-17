import { Module } from '@nestjs/common';
import { TypeOrmGameModule } from 'src/frameworks/game/typeorm';

@Module({
  imports: [TypeOrmGameModule],
  exports: [TypeOrmGameModule],
})
export class GameModule {}
