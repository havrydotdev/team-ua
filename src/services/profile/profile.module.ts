import { Module } from '@nestjs/common';
import { TypeOrmProfileModule } from 'src/frameworks/profile/typeorm';

@Module({
  imports: [TypeOrmProfileModule],
  exports: [TypeOrmProfileModule],
})
export class ProfileModule {}
