/* eslint-disable perfectionist/sort-classes */
import { Ctx, Hears, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import {
  CLEAR_LAST_WIZARD_ID,
  LEAVE_PROFILES_CALLBACK,
  NEXT_PROFILE_CALLBACK,
  PROFILES_WIZARD_ID,
  REPORT_CALLBACK,
} from 'src/core/constants';
import { ReqUser } from 'src/core/decorators';
import { CreateReportDto } from 'src/core/dtos';
import { Profile, User } from 'src/core/entities';
import { getCaption, getProfileMarkup } from 'src/core/utils';
import { HandlerResponse, ProfilesWizardContext } from 'src/types';
import { ProfileUseCases } from 'src/use-cases/profile';
import { ReplyUseCases } from 'src/use-cases/reply';
import { ReportUseCases } from 'src/use-cases/reports';
import { deunionize } from 'telegraf';

@Wizard(PROFILES_WIZARD_ID)
export class ProfilesWizard {
  constructor(
    private readonly profileUseCases: ProfileUseCases,
    private readonly replyUseCases: ReplyUseCases,
    private readonly reportUseCases: ReportUseCases,
  ) {}

  // TODO: add ban button for admins
  @WizardStep(1)
  async onEnter(
    @Ctx() ctx: ProfilesWizardContext,
    @ReqUser() user: User,
  ): Promise<HandlerResponse> {
    if (!ctx.session.seenProfiles) {
      ctx.session.seenProfiles = [];
    }

    if (!ctx.session.seenLength) {
      ctx.session.seenLength = 0;
    }

    const current = await this.profileUseCases.findRecommended(
      user.profile,
      ctx.session.seenProfiles,
    );

    if (!current) {
      await ctx.scene.enter(CLEAR_LAST_WIZARD_ID);

      return;
    }
    ctx.wizard.state.current = current;

    ctx.session.seenProfiles.push(current.id);
    ctx.session.seenLength++;
    ctx.wizard.next();

    const reply_markup = getProfileMarkup(
      `https://t.me/${
        deunionize(await ctx.telegram.getChat(current.user.id)).username
      }`,
    );

    const caption = getCaption(current);
    await ctx.replyWithPhoto(current.fileId, {
      caption,
      reply_markup,
    });
  }

  @WizardStep(2)
  @Hears([NEXT_PROFILE_CALLBACK, LEAVE_PROFILES_CALLBACK, REPORT_CALLBACK])
  async onAction(
    @Ctx() ctx: ProfilesWizardContext,
    @Message() msg: { text: string },
  ): Promise<HandlerResponse> {
    switch (msg.text) {
      case NEXT_PROFILE_CALLBACK: {
        ctx.scene.reenter();

        break;
      }

      case LEAVE_PROFILES_CALLBACK: {
        ctx.scene.reenter();

        break;
      }

      case REPORT_CALLBACK: {
        ctx.wizard.next();

        return 'messages.report.send';
      }
    }
  }

  // TODO: add pipe for message validation
  @WizardStep(3)
  @On('text')
  async onReport(
    @Ctx() ctx: ProfilesWizardContext,
    @Message() msg: { text: string },
  ): Promise<HandlerResponse> {
    const reportDto: CreateReportDto = {
      description: msg.text,
      reporterId: ctx.from.id,
      userId: (ctx.wizard.state.current as Profile).user.id,
    };

    const report = await this.reportUseCases.createReport(reportDto);

    await this.replyUseCases.sendToReportsChannel(report);

    await ctx.scene.leave();

    return 'messages.report.ok';
  }
}
