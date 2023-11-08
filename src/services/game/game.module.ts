import { Module } from '@nestjs/common';
import { TypeOrmGameModule } from 'src/frameworks/game/typeorm';

@Module({
  exports: [TypeOrmGameModule],
  imports: [TypeOrmGameModule],
})
export class GameModule {}
