import { Injectable } from '@nestjs/common';
import { IUserService } from 'src/core/abstracts';
import { CreateUserDto, UpdateUserDto } from 'src/core/dtos';
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

  async update(userId: number, dto: UpdateUserDto) {
    const user = this.userFactory.update(dto);

    return this.userService.update(userId, user);
  }

  async findById(userId: number): Promise<User | null> {
    return this.userService.findById(userId);
  }
}
