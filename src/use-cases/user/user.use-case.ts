import { Injectable } from '@nestjs/common';
import { IUserService } from 'src/core/abstracts';
import { CreateUserDto } from 'src/core/dtos';
import { User } from 'src/core/entities';

import { UserFactoryService } from './user-factory.service';

@Injectable()
export class UserUseCases {
  constructor(
    private readonly userService: IUserService,
    private readonly userFactory: UserFactoryService,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = this.userFactory.create(dto);

    return this.userService.create(user);
  }

  async findById(userId: number): Promise<null | User> {
    return this.userService.findById(userId);
  }
}
