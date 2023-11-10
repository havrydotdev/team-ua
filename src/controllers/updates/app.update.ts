import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import {
  Action,
  Command,
  Ctx,
  Hears,
  Help,
  On,
  Start,
  Update,
} from 'nestjs-telegraf';
import {
  CHANGE_LANG_WIZARD_ID,
  COOP_CALLBACK,
  HELP_CALLBACK,
  Keyboards,
  LANG_CALLBACK,
  LOOK_CALLBACK,
  PROFILE_CALLBACK,
  PROFILES_WIZARD_ID,
  REGISTER_WIZARD_ID,
  SEND_MESSAGE_WIZARD_ID,
  UPDATE_PROFILE_CALLBACK,
} from 'src/core/constants';
import { Roles } from 'src/core/decorators';
import { Game, Profile } from 'src/core/entities';
import { getCaption, getMeMarkup, getProfileCacheKey } from 'src/core/utils';
import { HandlerResponse, Language, MessageContext } from 'src/types';
import { GameUseCases } from 'src/use-cases/game';
import { ProfileUseCases } from 'src/use-cases/profile';
import { ReplyUseCases } from 'src/use-cases/reply';
import { ReportUseCases } from 'src/use-cases/reports';
import { deunionize, Markup } from 'telegraf';
import { InlineQueryResult } from 'telegraf/typings/core/types/typegram';

// TODO: add release notes command
@Update()
export class AppUpdate {
  constructor(
    private readonly replyUseCases: ReplyUseCases,
    private readonly gameUseCases: GameUseCases,
    private readonly reportUseCases: ReportUseCases,
    private readonly profileUseCases: ProfileUseCases,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  @Command('coop')
  @Hears(COOP_CALLBACK)
  async onCoop(): Promise<HandlerResponse> {
    return [
      'commands.coop',
      {
        parse_mode: 'HTML',
      },
    ];
  }

  @Help()
  @Hears(HELP_CALLBACK)
  async onHelp(): Promise<HandlerResponse> {
    return 'commands.help';
  }

  @On('inline_query')
  async onInlineQuery(@Ctx() ctx: MessageContext): Promise<HandlerResponse> {
    const games: Game[] = await this.gameUseCases.findStartsWith(
      ctx.inlineQuery.query,
    );

    await ctx.answerInlineQuery(
      games.map(
        (game): InlineQueryResult => ({
          description: game.description,
          id: game.id.toString(),
          input_message_content: {
            message_text: game.title,
          },
          thumbnail_url: game.image,
          title: game.title,
          type: 'article',
        }),
      ),
    );
  }

  @Command('language')
  @Hears(LANG_CALLBACK)
  async onLanguage(@Ctx() ctx: MessageContext): Promise<HandlerResponse> {
    await ctx.scene.enter(CHANGE_LANG_WIZARD_ID);
  }

  @Command('me')
  @Hears(PROFILE_CALLBACK)
  async onMe(@Ctx() ctx: MessageContext): Promise<HandlerResponse> {
    const cached = await this.cache.get<Profile>(
      getProfileCacheKey(ctx.from.id),
    );
    if (!cached) {
      await ctx.scene.enter(CHANGE_LANG_WIZARD_ID);

      return;
    }

    await ctx.replyWithPhoto(cached.fileId, {
      caption: getCaption(cached),
      reply_markup: getMeMarkup(
        this.replyUseCases.translate(
          'messages.profile.update',
          ctx.session.lang,
        ),
      ),
    });
  }

  @Command('profiles')
  @Hears(LOOK_CALLBACK)
  async onProfiles(@Ctx() ctx: MessageContext): Promise<HandlerResponse> {
    const cached = await this.cache.get<Profile>(
      getProfileCacheKey(ctx.from.id),
    );
    if (!cached) {
      await ctx.scene.enter(REGISTER_WIZARD_ID);
    }

    await this.replyUseCases.replyI18n(ctx, 'messages.searching_teammates', {
      reply_markup: Markup.removeKeyboard().reply_markup,
    });

    await this.replyUseCases.replyI18n(ctx, 'commands.profiles', {
      reply_markup: Keyboards.profiles,
    });

    await ctx.scene.enter(PROFILES_WIZARD_ID);
  }

  // TODO
  // @Action(/reporter-info-*/)
  // async onReporterInfo(@Ctx() ctx: MessageContext): Promise<HandlerResponse> {}

  @Roles(['admin'])
  @Command('send_message')
  async onSendMessage(@Ctx() ctx: MessageContext): Promise<HandlerResponse> {
    await ctx.scene.enter(SEND_MESSAGE_WIZARD_ID);
  }

  @Action(/sen-*/)
  async onSentence(@Ctx() ctx: MessageContext): Promise<HandlerResponse> {
    const userId = parseInt(
      deunionize(ctx.callbackQuery).data.replace('sen-', ''),
    );

    await this.profileUseCases.deleteByUser(userId);

    await this.replyUseCases.sendMsgToChatI18n(
      userId,
      Language.UA,
      'messages.profile.deleted',
    );
  }

  @Roles(['admin'])
  @Command('set_reports_channel')
  async onSetReportsBranch(
    @Ctx() ctx: MessageContext,
  ): Promise<HandlerResponse> {
    await this.reportUseCases.createReportChannel({
      id: ctx.chat.id,
    });

    return 'messages.report.channel.ok';
  }

  @Start()
  async onStart(@Ctx() ctx: MessageContext): Promise<HandlerResponse> {
    const cached = await this.cache.get<Profile>(
      getProfileCacheKey(ctx.from.id),
    );
    if (!cached) {
      await ctx.scene.enter(CHANGE_LANG_WIZARD_ID);
    }

    return 'commands.start';
  }

  @Action(UPDATE_PROFILE_CALLBACK)
  async onUpdateProfile(@Ctx() ctx: MessageContext): Promise<HandlerResponse> {
    await ctx.scene.enter(REGISTER_WIZARD_ID);
  }
}
