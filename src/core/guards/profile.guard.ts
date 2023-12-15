import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Cache } from 'cache-manager';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { MessageContext } from 'src/types';
import { UserUseCases } from 'src/use-cases/user';

import { REGISTERED_METADATA_KEY } from '../constants';
import { InjectCache } from '../decorators';
import { User } from '../entities';
import { ProfileException } from '../errors';
import { getProfileCacheKey } from '../utils';

@Injectable()
export class ProfileGuard implements CanActivate {
  constructor(
    @InjectCache() private readonly cache: Cache,
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
    if (!cachedUser || !cachedUser.profile) {
      let user = await this.userUseCases.findById(tgCtx.from.id);
      if (!user) {
        const createdUser = await this.userUseCases.create({
          id: tgCtx.from.id,
        });

        user = createdUser;
      }

      await this.cache.set(profileKey, user);

      cachedUser = user;
    }

    req.user = cachedUser;

    if (isProfileRequired && !cachedUser.profile) {
      throw new ProfileException();
    }

    return true;
  }
}
