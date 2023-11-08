import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Ctx, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import {
  CHANGE_LANG_WIZARD_ID,
  Keyboards,
  NEXT_WIZARD_ID,
  REGISTER_WIZARD_ID,
} from 'src/core/constants';
import { getProfileCacheKey } from 'src/core/utils';
import { HandlerResponse, Language, WizardContext } from 'src/types';
import { ReplyUseCases } from 'src/use-cases/reply';

@Wizard(CHANGE_LANG_WIZARD_ID)
export class ChangeLangWizard {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly replyUseCases: ReplyUseCases,
  ) {}

  @WizardStep(1)
  async onEnter(@Ctx() ctx: WizardContext): Promise<HandlerResponse> {
    const profile = await this.cache.get(getProfileCacheKey(ctx.from.id));

    ctx.wizard.next();

    return [
      profile ? 'messages.lang.update' : 'messages.lang.select',
      { reply_markup: Keyboards.selectLang },
    ];
  }

  @On('text')
  @WizardStep(2)
  async onLang(
    @Ctx() ctx: WizardContext,
    @Message() msg: { text: string },
  ): Promise<HandlerResponse> {
    const profile = await this.cache.get(getProfileCacheKey(ctx.from.id));

    switch (msg.text) {
      case '🇺🇦':
        ctx.session.lang = Language.UA;
        break;
      case '🇬🇧':
        ctx.session.lang = Language.EN;
        break;
      default:
        return 'messages.lang.invalid';
    }

    await ctx.scene.leave();

    if (!profile) {
      await this.replyUseCases.replyI18n(ctx, 'messages.lang.changed');

      await ctx.scene.enter(REGISTER_WIZARD_ID);
      return;
    }

    await this.replyUseCases.replyI18n(ctx, 'messages.lang.changed', {
      reply_markup: Keyboards.remove,
    });
    await ctx.scene.enter(NEXT_WIZARD_ID);

    return;
  }
}
