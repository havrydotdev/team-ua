import { SkipThrottle } from '@nestjs/throttler';
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
  LANG_CALLBACK,
  LOOK_CALLBACK,
  PROFILE_CALLBACK,
  PROFILES_WIZARD_ID,
  REGISTER_WIZARD_ID,
  SEND_MESSAGE_WIZARD_ID,
  UPDATE_PROFILE_CALLBACK,
} from 'src/core/constants';
import { Registered, ReqUser, Roles } from 'src/core/decorators';
import { Game, User } from 'src/core/entities';
import {
  getCaption,
  getMeMarkup,
  getProfilesWizardMarkup,
} from 'src/core/utils';
import { HandlerResponse, MessageContext } from 'src/types';
import { GameUseCases } from 'src/use-cases/game';
import { ProfileUseCases } from 'src/use-cases/profile';
import { ReplyUseCases } from 'src/use-cases/reply';
import { ReportUseCases } from 'src/use-cases/report';
import { deunionize } from 'telegraf';
import { InlineQueryResult } from 'telegraf/typings/core/types/typegram';

@Update()
export class AppUpdate {
  constructor(
    private readonly replyUseCases: ReplyUseCases,
    private readonly gameUseCases: GameUseCases,
    private readonly reportUseCases: ReportUseCases,
    private readonly profileUseCases: ProfileUseCases,
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
  @SkipThrottle()
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
  @Registered()
  @Hears(PROFILE_CALLBACK)
  async onMe(
    @Ctx() ctx: MessageContext,
    @ReqUser() user: User,
  ): Promise<HandlerResponse> {
    await ctx.replyWithPhoto(user.profile.fileId, {
      caption: getCaption(user.profile),
      reply_markup: getMeMarkup(
        this.replyUseCases.translate('messages.profile.update', user.lang),
      ),
    });
  }

  @Command('profiles')
  @Registered()
  @Hears(LOOK_CALLBACK)
  async onProfiles(
    @Ctx() ctx: MessageContext,
    @ReqUser() user: User,
  ): Promise<HandlerResponse> {
    await this.replyUseCases.replyI18n(ctx, 'commands.profiles', {
      reply_markup: getProfilesWizardMarkup(user.role),
    });

    await ctx.scene.enter(PROFILES_WIZARD_ID);
  }

  @Action(/reporter-info-*/)
  async onReporterInfo(@Ctx() ctx: MessageContext): Promise<HandlerResponse> {
    const userId = parseInt(
      deunionize(ctx.callbackQuery).data.replace('sen-', ''),
    );

    const profile = await this.profileUseCases.findByUser(userId);

    await ctx.replyWithPhoto(profile.fileId, {
      caption: getCaption(profile),
    });
  }

  @Roles(['admin'])
  @Command('send_message')
  async onSendMessage(@Ctx() ctx: MessageContext): Promise<HandlerResponse> {
    await ctx.scene.enter(SEND_MESSAGE_WIZARD_ID);
  }

  @Roles(['admin'])
  @Action(/sen-*/)
  async onSentence(@Ctx() ctx: MessageContext): Promise<HandlerResponse> {
    const userId = parseInt(
      deunionize(ctx.callbackQuery).data.replace('sen-', ''),
    );

    await this.profileUseCases.deleteByUser(userId);

    await this.replyUseCases.sendMsgToChatI18n(
      userId,
      'messages.profile.delete.message',
    );
  }

  @Roles(['admin'])
  @Registered()
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
  @Registered()
  async onStart(): Promise<HandlerResponse> {
    return 'commands.start';
  }

  @Registered()
  @Action(UPDATE_PROFILE_CALLBACK)
  async onUpdateProfile(@Ctx() ctx: MessageContext): Promise<HandlerResponse> {
    console.log({ ctx });
    await ctx.scene.enter(REGISTER_WIZARD_ID);
  }
}
