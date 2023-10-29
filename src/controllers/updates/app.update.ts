import { Logger } from '@nestjs/common';
import { Action, Command, Ctx, Help, On, Start, Update } from 'nestjs-telegraf';
import { CHANGE_LANG_WIZARD_ID } from 'src/core/constants';
import { Game } from 'src/core/entities';
import { getCaption } from 'src/core/utils';
import { MessageContext, MsgKey } from 'src/types';
import { GameUseCases } from 'src/use-cases/game';
import { ReplyUseCases } from 'src/use-cases/reply';
import { InlineQueryResult } from 'telegraf/typings/core/types/typegram';

@Update()
export class AppUpdate {
  private readonly logger = new Logger(AppUpdate.name);

  constructor(
    private readonly replyUseCases: ReplyUseCases,
    private readonly gameUseCases: GameUseCases,
  ) {}

  @Start()
  async onStart(@Ctx() ctx: MessageContext): Promise<MsgKey> {
    this.logger.log(`/start ${ctx.from.username}`);

    if (!ctx.session.user.profile) {
      await this.replyUseCases.replyI18n(ctx, 'messages.start');

      await ctx.scene.enter(CHANGE_LANG_WIZARD_ID);

      return;
    }

    return 'messages.start';
  }

  @Action('language')
  @Command('language')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async onLanguage(@Ctx() ctx: MessageContext): Promise<void> {
    this.logger.log(`/language ${ctx.from.username}`);

    await ctx.scene.enter(CHANGE_LANG_WIZARD_ID);
  }

  @Action('me')
  @Command('me')
  async onMe(@Ctx() ctx: MessageContext) {
    this.logger.log(`/me ${ctx.from.username}`);

    await ctx.replyWithPhoto(
      { url: ctx.session.user.profile.file.url },
      {
        caption: getCaption(ctx.session.user.profile),
      },
    );
  }

  @Help()
  @Action('help')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async onHelp(@Ctx() ctx: MessageContext): Promise<MsgKey> {
    this.logger.log(`/help ${ctx.from.username}`);

    return 'messages.help';
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
