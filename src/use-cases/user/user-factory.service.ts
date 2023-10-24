import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from 'src/core/dtos';
import { User } from 'src/core/entities';

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
