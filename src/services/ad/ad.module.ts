import { Module } from '@nestjs/common';
import { TypeOrmAdModule } from 'src/frameworks/ad/typeorm';

@Module({
  exports: [TypeOrmAdModule],
  imports: [TypeOrmAdModule],
})
export class AdModule {}
