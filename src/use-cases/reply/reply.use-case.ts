import { Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { I18nService } from 'nestjs-i18n';
import { IReportService } from 'src/core/abstracts';
import { IReplyService } from 'src/core/abstracts/reply.abstract.service';
import { InjectCache } from 'src/core/decorators';
import { Report, User } from 'src/core/entities';
import { BaseProps, PhotoProps, TextProps } from 'src/core/props';
import { I18nTextProps } from 'src/core/props/i18n-text.props';
import {
  getProfileCacheKey,
  getReportCaption,
  getReportMarkup,
} from 'src/core/utils';
import { I18nTranslations } from 'src/generated/i18n.generated';
import {
  Extra,
  I18nArgs,
  Language,
  MsgKey,
  SendPhotoArgs,
  SendPhotoReturnType,
  SendTextArgs,
  SendTextReturnType,
} from 'src/types';

@Injectable()
export class ReplyUseCases {
  constructor(
    private readonly replyService: IReplyService,
    private readonly reportService: IReportService,
    private readonly i18n: I18nService<I18nTranslations>,
    @InjectCache() private readonly cache: Cache,
  ) {}

  async replyI18n(
    chatId: number,
    key: MsgKey,
    extra?: Extra,
  ): SendTextReturnType {
    const user = await this.cache.get<User>(getProfileCacheKey(chatId));

    return this.sendMessageI18n(chatId, user.lang, key, extra);
  }

  send(...props: BaseProps[]): any[] {
    const responses: any[] = [];

    props.forEach(async (prop: BaseProps) => {
      const response = await this.sendProp(prop);

      responses.push(response);
    });

    return responses;
  }

  sendMessage(...args: SendTextArgs): SendTextReturnType {
    return this.replyService.sendMessage(...args);
  }

  sendMessageI18n(
    chatId: number,
    lang: Language,
    key: MsgKey,
    extra?: Extra,
  ): SendTextReturnType {
    return this.replyService.sendMessage(
      chatId,
      this.translate(key, lang),
      extra,
    );
  }

  sendPhoto(...args: SendPhotoArgs): SendPhotoReturnType {
    return this.replyService.sendPhoto(...args);
  }

  sendProp(prop: BaseProps): Promise<any> {
    switch (true) {
      case prop instanceof I18nTextProps: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return this.sendMessageI18n(...prop.data);
      }

      case prop instanceof TextProps: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return this.sendMessage(...prop.data);
      }

      case prop instanceof PhotoProps: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return this.sendPhoto(...prop.data);
      }

      default: {
        throw new Error('Prop is not implemented');
      }
    }
  }

  async sendToReportsChannel(report: Report) {
    const reportsChannel = await this.reportService.findReportsChannel();

    await this.sendPhoto(reportsChannel.id, report.user.profile.fileId, {
      caption: getReportCaption(report.user.profile),
      reply_markup: getReportMarkup(report.user.id, report.reporter.id),
    });
  }

  translate(key: MsgKey, lang: Language, args?: I18nArgs): string {
    return this.i18n.t(key, {
      args,
      lang,
    });
  }
}
