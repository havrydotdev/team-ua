import { Module } from '@nestjs/common';
import { TypeOrmProfileModule } from 'src/frameworks/profile/typeorm';

@Module({
  exports: [TypeOrmProfileModule],
  imports: [TypeOrmProfileModule],
})
export class ProfileModule {}
