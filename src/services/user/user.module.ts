import { Module } from '@nestjs/common';
import { TypeOrmUserModule } from 'src/frameworks/user/typeorm';

@Module({
  exports: [TypeOrmUserModule],
  imports: [TypeOrmUserModule],
})
export class UserModule {}
