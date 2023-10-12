import { Injectable } from '@nestjs/common';
import { CreateUserDto, IUserService, UpdateUserDto, User } from 'src/core';
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

  async update(userId: number, dto: UpdateUserDto) {
    const user = this.userFactory.update(dto);

    return this.userService.update(userId, user);
  }

  async getByTgId(tgId: number): Promise<User> {
    return this.userService.findByTgId(tgId);
  }
}
