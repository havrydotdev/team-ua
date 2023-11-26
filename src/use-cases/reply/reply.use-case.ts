import { Injectable } from '@nestjs/common';
import { IReportService } from 'src/core/abstracts';
import { IReplyService } from 'src/core/abstracts/reply.abstract.service';
import { Report } from 'src/core/entities';
import { getReportCaption, getReportMarkup } from 'src/core/utils';
import { Extra, I18nArgs, Language, MsgKey, PhotoExtra } from 'src/types';
import { Context } from 'telegraf';

@Injectable()
export class ReplyUseCases {
  constructor(
    private readonly replyService: IReplyService,
    private readonly reportService: IReportService,
  ) {}

  async replyI18n(ctx: Context, key: MsgKey, params?: Extra) {
    await this.replyService.reply(ctx, key, params);
  }

  async sendMsgToChat(chatId: number, msg: string, args?: Extra) {
    await this.replyService.sendPhotoToChat(chatId, msg, args);
  }

  async sendMsgToChatI18n(chatId: number, key: MsgKey, args?: Extra) {
    await this.replyService.sendMsgToChatI18n(chatId, key, args);
  }

  async sendPhotoToChat(chatId: number, fileId: string, args?: PhotoExtra) {
    await this.replyService.sendPhotoToChat(chatId, fileId, args);
  }

  async sendToReportsChannel(report: Report) {
    const reportsChannel = await this.reportService.findReportsChannel();

    await this.sendPhotoToChat(reportsChannel.id, report.user.profile.fileId, {
      caption: getReportCaption(report.user.profile),
      reply_markup: getReportMarkup(report.user.id, report.reporter.id),
    });
  }

  translate(key: MsgKey, lang: Language, args?: I18nArgs): string {
    return this.replyService.translate(key, lang, args);
  }
}
