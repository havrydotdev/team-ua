import { Module } from '@nestjs/common';
import { TypeOrmUserService } from './typeorm-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/core';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [TypeOrmUserService],
  providers: [TypeOrmUserService],
})
export class TypeOrmUserModule {}
