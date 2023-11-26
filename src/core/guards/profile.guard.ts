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

import { CHANGE_LANG_WIZARD_ID, REGISTERED_METADATA_KEY } from '../constants';
import { Profile } from '../entities';
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

    let profile = await this.cache.get<Profile>(profileKey);
    if (!profile) {
      const user = await this.userUseCases.findById(tgCtx.from.id);
      if (!user) {
        await this.userUseCases.create({
          id: tgCtx.from.id,
        });
      }

      await this.cache.set(profileKey, user.profile);
      profile = user.profile;
    }
    req.profile = profile;
    if (isProfileRequired && !profile) {
      await tgCtx.scene.enter(CHANGE_LANG_WIZARD_ID);

      return;
    }

    return true;
  }
}
