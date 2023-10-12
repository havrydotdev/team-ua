import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, User } from 'src/core';

@Injectable()
export class UserFactoryService {
  create(dto: CreateUserDto): User {
    return User.create({
      ...dto,
    });
  }

  update(dto: UpdateUserDto): User {
    return User.create({
      ...dto,
    });
  }
}
