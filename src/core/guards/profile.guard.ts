import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Cache } from 'cache-manager';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { MessageContext } from 'src/types';
import { UserUseCases } from 'src/use-cases/user';

import { REGISTERED_METADATA_KEY } from '../constants';
import { User } from '../entities';
import { ProfileException } from '../errors';
import { getProfileCacheKey } from '../utils';

@Injectable()
export class ProfileGuard implements CanActivate {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly userUseCases: UserUseCases,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const tgExecutionContext = TelegrafExecutionContext.create(ctx);
    const req = ctx.switchToHttp().getRequest();
    const tgCtx = tgExecutionContext.getContext<MessageContext>();
    const profileKey = getProfileCacheKey(tgCtx.from.id);
    const isProfileRequired = this.reflector.get(
      REGISTERED_METADATA_KEY,
      ctx.getHandler(),
    );

    let cachedUser = await this.cache.get<User>(profileKey);
    if (!cachedUser) {
      const user = await this.userUseCases.findById(tgCtx.from.id);
      if (!user) {
        await this.userUseCases.create({
          id: tgCtx.from.id,
        });
      }

      const userToCache =
        user ?? ({ id: tgCtx.from.id, profile: null } as User);

      await this.cache.set(profileKey, userToCache);

      cachedUser = userToCache;
    }

    req.user = cachedUser;

    if (isProfileRequired && !cachedUser.profile) {
      throw new ProfileException();
    }

    return true;
  }
}
