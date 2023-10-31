import { Command, Ctx, Hears, Help, On, Start, Update } from 'nestjs-telegraf';
import {
  CHANGE_LANG_WIZARD_ID,
  COOP_CALLBACK,
  HELP_CALLBACK,
  LANG_CALLBACK,
  LEAVE_PROFILES_CALLBACK,
  LOOK_CALLBACK,
  NEXT_PROFILE_CALLBACK,
  PROFILES_WIZARD_ID,
  PROFILE_CALLBACK,
} from 'src/core/constants';
import { Game } from 'src/core/entities';
import { getCaption } from 'src/core/utils';
import { MessageContext, MsgKey, MsgWithExtra } from 'src/types';
import { GameUseCases } from 'src/use-cases/game';
import { ReplyUseCases } from 'src/use-cases/reply';
import { Markup } from 'telegraf';
import { InlineQueryResult } from 'telegraf/typings/core/types/typegram';

@Update()
export class AppUpdate {
  constructor(
    private readonly replyUseCases: ReplyUseCases,
    private readonly gameUseCases: GameUseCases,
  ) {}

  @Start()
  async onStart(@Ctx() ctx: MessageContext): Promise<MsgKey> {
    if (!ctx.session.user.profile) {
      await this.replyUseCases.replyI18n(ctx, 'commands.start');

      await ctx.scene.enter(CHANGE_LANG_WIZARD_ID);

      return;
    }

    return 'commands.start';
  }

  @Command('language')
  @Hears(LANG_CALLBACK)
  async onLanguage(@Ctx() ctx: MessageContext): Promise<void> {
    await ctx.scene.enter(CHANGE_LANG_WIZARD_ID);
  }

  @Command('me')
  @Hears(PROFILE_CALLBACK)
  async onMe(@Ctx() ctx: MessageContext) {
    await ctx.replyWithPhoto(
      { url: ctx.session.user.profile.file.url },
      {
        caption: getCaption(ctx.session.user.profile),
      },
    );
  }

  @Command('coop')
  @Hears(COOP_CALLBACK)
  async onCoop(): Promise<MsgWithExtra> {
    return [
      'commands.coop',
      {
        parse_mode: 'HTML',
      },
    ];
  }

  @Command('profiles')
  @Hears(LOOK_CALLBACK)
  async onProfiles(@Ctx() ctx: MessageContext): Promise<void> {
    await this.replyUseCases.replyI18n(ctx, 'messages.searching_teammates', {
      reply_markup: Markup.removeKeyboard().reply_markup,
    });

    await this.replyUseCases.replyI18n(ctx, 'commands.profiles', {
      reply_markup: Markup.keyboard([
        [
          Markup.button.callback(NEXT_PROFILE_CALLBACK, NEXT_PROFILE_CALLBACK),
          Markup.button.callback(
            LEAVE_PROFILES_CALLBACK,
            LEAVE_PROFILES_CALLBACK,
          ),
        ],
      ]).resize(true).reply_markup,
    });

    await ctx.scene.enter(PROFILES_WIZARD_ID);
  }

  @Help()
  @Hears(HELP_CALLBACK)
  async onHelp(): Promise<MsgKey> {
    return 'commands.help';
  }

  @On('inline_query')
  async onInlineQuery(@Ctx() ctx: MessageContext) {
    const games: Game[] = await this.gameUseCases.findStartsWith(
      ctx.inlineQuery.query,
    );

    await ctx.answerInlineQuery(
      games.map(
        (game): InlineQueryResult => ({
          type: 'article',
          id: game.id.toString(),
          title: game.title,
          description: game.description,
          thumbnail_url: game.image,
          input_message_content: {
            message_text: game.title,
          },
        }),
      ),
    );
  }
}
