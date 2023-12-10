import { Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { IUserService } from 'src/core/abstracts';
import { InjectCache } from 'src/core/decorators';
import { CreateUserDto, UpdateUserDto } from 'src/core/dtos';
import { User } from 'src/core/entities';
import { getProfileCacheKey } from 'src/core/utils';

import { UserFactoryService } from './user-factory.service';

@Injectable()
export class UserUseCases {
  constructor(
    @InjectCache() private readonly cache: Cache,
    private readonly userService: IUserService,
    private readonly userFactory: UserFactoryService,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = this.userFactory.create(dto);

    return this.userService.create(user);
  }

  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  async findById(userId: number): Promise<null | User> {
    return this.userService.findById(userId);
  }

  async update(dto: UpdateUserDto): Promise<User> {
    const user = await this.cache.get<User>(getProfileCacheKey(dto.id));

    const userEntity = this.userFactory.update(dto);

    if (user) {
      await this.cache.set(getProfileCacheKey(dto.id), {
        ...user,
        lang: dto.lang,
      });
    }

    return this.userService.update(dto.id, userEntity);
  }
}
