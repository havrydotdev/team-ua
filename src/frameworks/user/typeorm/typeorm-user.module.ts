import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IUserService } from 'src/core/abstracts';
import { User } from 'src/core/entities';
import { TypeOrmUserService } from './typeorm-user.service';

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
