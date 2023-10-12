import { Module } from '@nestjs/common';
import { TypeOrmUserModule } from 'src/frameworks/user/typeorm';

@Module({
  imports: [TypeOrmUserModule],
  exports: [TypeOrmUserModule],
})
export class UserModule {}
