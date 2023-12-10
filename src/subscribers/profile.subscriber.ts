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
    await this.cache.del(getProfileCacheKey(event.entity.user.id));
  }

  async afterRemove(event: RemoveEvent<Profile>): Promise<any> {
    await this.cache.del(getProfileCacheKey(event.entity.user.id));
  }

  async afterUpdate(event: UpdateEvent<any>): Promise<any> {
    await this.cache.del(getProfileCacheKey(event.entity.user.id));
  }

  listenTo() {
    return Profile;
  }
}
