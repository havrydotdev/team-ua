import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Ctx, Hears, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import {
  CLEAR_LAST_WIZARD_ID,
  LEAVE_PROFILES_CALLBACK,
  NEXT_PROFILE_CALLBACK,
  NEXT_WIZARD_ID,
  PROFILES_WIZARD_ID,
  REPORT_CALLBACK,
} from 'src/core/constants';
import { CreateReportDto } from 'src/core/dtos';
import { Profile } from 'src/core/entities';
import {
  getCaption,
  getProfileCacheKey,
  getProfileMarkup,
} from 'src/core/utils';
import { HandlerResponse, ProfilesWizardContext } from 'src/types';
import { ProfileUseCases } from 'src/use-cases/profile';
import { ReplyUseCases } from 'src/use-cases/reply';
import { ReportUseCases } from 'src/use-cases/reports';
import { deunionize } from 'telegraf';

// TODO: implement ads functionality
@Wizard(PROFILES_WIZARD_ID)
export class ProfilesWizard {
  constructor(
    private readonly profileUseCases: ProfileUseCases,
    private readonly replyUseCases: ReplyUseCases,
    private readonly reportUseCases: ReportUseCases,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  @WizardStep(2)
  @Hears([NEXT_PROFILE_CALLBACK, LEAVE_PROFILES_CALLBACK, REPORT_CALLBACK])
  async onAction(
    @Ctx() ctx: ProfilesWizardContext,
    @Message() msg: { text: string },
  ): Promise<HandlerResponse> {
    switch (msg.text) {
      case NEXT_PROFILE_CALLBACK: {
        ctx.scene.leave();

        await ctx.scene.enter(PROFILES_WIZARD_ID);

        break;
      }

      case LEAVE_PROFILES_CALLBACK: {
        ctx.scene.leave();

        await ctx.scene.enter(NEXT_WIZARD_ID);

        break;
      }

      case REPORT_CALLBACK: {
        ctx.wizard.next();

        return 'messages.report.send';
      }
    }
  }

  @WizardStep(1)
  async onEnter(@Ctx() ctx: ProfilesWizardContext): Promise<HandlerResponse> {
    if (!ctx.session.seenProfiles) {
      ctx.session.seenProfiles = [];
    }

    if (!ctx.session.seenLength) {
      ctx.session.seenLength = 0;
    }

    const cached = await this.cache.get<Profile>(
      getProfileCacheKey(ctx.from.id),
    );
    const profile = await this.profileUseCases.findRecommended(
      cached,
      ctx.session.seenProfiles,
      ctx.session.seenLength,
    );

    ctx.wizard.state.current = profile;

    if (!profile) {
      await ctx.scene.enter(CLEAR_LAST_WIZARD_ID);

      return;
    }

    ctx.session.seenProfiles.push(profile.id);
    ctx.session.seenLength++;
    ctx.wizard.next();

    const chat = await ctx.telegram.getChat(profile.user.id);

    await ctx.replyWithPhoto(profile.fileId, {
      caption: getCaption(profile),
      reply_markup: getProfileMarkup(
        `https://t.me/${deunionize(chat).username}`,
      ),
    });
  }

  @WizardStep(3)
  @On('text')
  async onText(
    @Ctx() ctx: ProfilesWizardContext,
    @Message() msg: { text: string },
  ): Promise<HandlerResponse> {
    const reportDto: CreateReportDto = {
      description: msg.text,
      reporterId: ctx.from.id,
      userId: ctx.wizard.state.current.user.id,
    };

    const report = await this.reportUseCases.createReport(reportDto);

    await this.replyUseCases.sendToReportsChannel(report);

    await ctx.scene.leave();

    return 'messages.report.ok';
  }
}
