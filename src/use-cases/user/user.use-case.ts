import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { IUserService } from 'src/core/abstracts';
import { CreateUserDto, UpdateUserDto } from 'src/core/dtos';
import { Profile, User } from 'src/core/entities';
import { getProfileCacheKey } from 'src/core/utils';

import { UserFactoryService } from './user-factory.service';

@Injectable()
export class UserUseCases {
  constructor(
    private readonly userService: IUserService,
    private readonly userFactory: UserFactoryService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = this.userFactory.create(dto);

    return this.userService.create(user);
  }

  async findById(userId: number): Promise<null | User> {
    return this.userService.findById(userId);
  }

  async update(dto: UpdateUserDto): Promise<User> {
    const profile = await this.cache.get<Profile>(getProfileCacheKey(dto.id));

    const user = this.userFactory.update(dto);

    if (profile) {
      await this.cache.set(getProfileCacheKey(dto.id), {
        ...profile,
        user,
      });
    }

    return this.userService.update(dto.id, user);
  }
}
