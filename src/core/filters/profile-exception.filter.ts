import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { TelegrafArgumentsHost } from 'nestjs-telegraf';
import { MessageContext } from 'src/types';

import { CHANGE_LANG_WIZARD_ID } from '../constants';
import { ProfileException } from '../errors';

@Catch(ProfileException)
export class ProfileExceptionFilter implements ExceptionFilter {
  async catch(_exception: ProfileException, host: ArgumentsHost) {
    const telegrafHost = TelegrafArgumentsHost.create(host);
    const ctx = telegrafHost.getContext<MessageContext>();

    await ctx.scene.enter(CHANGE_LANG_WIZARD_ID);
  }
}
