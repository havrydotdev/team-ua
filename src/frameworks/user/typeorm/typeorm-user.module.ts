import { Module } from '@nestjs/common';
import { TypeOrmUserService } from './typeorm-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IUserService, User } from 'src/core';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    TypeOrmUserService,
    {
      provide: IUserService,
      useClass: TypeOrmUserService,
    },
  ],
  exports: [IUserService],
})
export class TypeOrmUserModule {}
