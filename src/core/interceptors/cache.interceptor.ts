import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { MessageContext } from 'src/types';
import { UserUseCases } from 'src/use-cases/user';

import { Profile } from '../entities';
import { getProfileCacheKey } from '../utils';

// TODO: store language in database
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    private readonly userUseCases: UserUseCases,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async intercept(ctx: ExecutionContext, next: CallHandler) {
    const tgExecutionContext = TelegrafExecutionContext.create(ctx);
    const tgCtx = tgExecutionContext.getContext<MessageContext>();
    const profileKey = getProfileCacheKey(tgCtx.from.id);

    const profile = await this.cache.get<Profile>(profileKey);
    if (!profile) {
      console.log('profile is null');
      const user = await this.userUseCases.findById(tgCtx.from.id);
      if (!user) {
        console.log('created user');
        await this.userUseCases.create({
          id: tgCtx.from.id,
        });

        return next.handle();
      }

      if (!user.profile) {
        return next.handle();
      }

      await this.cache.set(profileKey, user.profile);
    }

    return next.handle();
  }
}
