import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { InjectCache } from 'src/core/decorators';
import { Profile } from 'src/core/entities';
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

    await this.cache.del(cacheKey);
  }

  async afterRemove(event: RemoveEvent<Profile>): Promise<any> {
    const cacheKey = getProfileCacheKey(event.entity.user.id);

    await this.cache.del(cacheKey);
  }

  async afterUpdate(event: UpdateEvent<any>): Promise<any> {
    const cacheKey = getProfileCacheKey(event.entity.user.id);

    await this.cache.del(cacheKey);
  }

  listenTo() {
    return Profile;
  }
}
