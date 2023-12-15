import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { InjectCache } from 'src/core/decorators';
import { Profile, User } from 'src/core/entities';
import { getProfileCacheKey } from 'src/core/utils';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';

@Injectable()
@EventSubscriber()
export class ProfileSubscriber implements EntitySubscriberInterface {
  constructor(
    @InjectDataSource() readonly dataSource: DataSource,
    @InjectCache() private readonly cache: Cache,
  ) {
    dataSource.subscribers.push(this);
  }

  async afterInsert(event: InsertEvent<Profile>) {
    const cacheKey = getProfileCacheKey(event.entity.user.id);
    const user = await this.cache.get<User>(cacheKey);

    await this.cache.set(cacheKey, {
      ...user,
      profile: undefined,
    });
  }

  async afterRemove(event: RemoveEvent<Profile>): Promise<any> {
    const cacheKey = getProfileCacheKey(event.entity.user.id);
    const user = await this.cache.get<User>(cacheKey);

    await this.cache.set(cacheKey, {
      ...user,
      profile: undefined,
    });
  }

  async afterUpdate(event: UpdateEvent<any>): Promise<any> {
    const cacheKey = getProfileCacheKey(event.entity.user.id);
    const user = await this.cache.get<User>(cacheKey);

    await this.cache.set(cacheKey, {
      ...user,
      profile: undefined,
    });
  }

  listenTo() {
    return Profile;
  }
}
