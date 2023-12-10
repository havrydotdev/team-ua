import { TestBed } from '@automock/jest';
import { createMock } from '@golevelup/ts-jest';
import { IReplyService } from 'src/core/abstracts';
import { IReportService } from 'src/core/abstracts';
import { Profile, Report, ReportsChannel, User } from 'src/core/entities';
import { Language, MsgKey } from 'src/types';
import { Context } from 'telegraf';

import { ReplyUseCases } from '../reply.use-case';

jest.mock('src/core/utils', () => {
  const originalModule = jest.requireActual('telegraf');

  // Mock the default export
  return {
    __esModule: true,
    ...originalModule,
    getReportCaption: jest.fn(),
    getReportMarkup: jest.fn(),
  };
});

describe('ReplyUseCases', () => {
  let useCases: ReplyUseCases;
  let replyService: IReplyService;
  let reportService: IReportService;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(ReplyUseCases).compile();

    useCases = unit;
    // @ts-expect-error - abstract class
    replyService = unitRef.get<IReplyService>(IReplyService);
    // @ts-expect-error - abstract class
    reportService = unitRef.get<IReportService>(IReportService);
  });

  it('should reply with i18n', async () => {
    const ctx = createMock<Context>();
    const key: MsgKey = 'messages.about';
    const params = {};

    await useCases.replyI18n(ctx, key, params);

    expect(replyService.reply).toHaveBeenCalledWith(ctx, key, params);
  });

  it('should send a message to chat', async () => {
    const chatId = 1;
    const msg = 'test';
    const args = {};

    await useCases.sendMsgToChat(chatId, msg, args);

    expect(replyService.sendPhotoToChat).toHaveBeenCalledWith(
      chatId,
      msg,
      args,
    );
  });

  it('should send a message to chat with i18n', async () => {
    const chatId = 1;
    const key: MsgKey = 'messages.about';
    const args = {};

    await useCases.sendMsgToChatI18n(chatId, key, args);

    expect(replyService.sendMsgToChatI18n).toHaveBeenCalledWith(
      chatId,
      key,
      args,
    );
  });

  it('should send a photo to chat', async () => {
    const chatId = 1;
    const fileId = 'test';
    const args = {};

    await useCases.sendPhotoToChat(chatId, fileId, args);

    expect(replyService.sendPhotoToChat).toHaveBeenCalledWith(
      chatId,
      fileId,
      args,
    );
  });

  it('should send to reports channel', async () => {
    const report: Report = createMock<Report>({
      description: 'Test',
      reporter: createMock<User>({
        id: 1,
      }),
      user: createMock<User>({
        id: 2,
        profile: createMock<Profile>({
          fileId: '12345',
        }),
      }),
    });
    const reportsChannel = createMock<ReportsChannel>({
      id: 1,
    });

    const findReportsChannelSpy = jest
      .spyOn(reportService, 'findReportsChannel')
      .mockResolvedValue(reportsChannel);

    await useCases.sendToReportsChannel(report);

    expect(findReportsChannelSpy).toHaveBeenCalled();
    expect(replyService.sendPhotoToChat).toHaveBeenCalledWith(
      reportsChannel.id,
      report.user.profile.fileId,
      expect.anything(),
    );
  });

  it('should translate', () => {
    const key: MsgKey = 'messages.about';
    const lang = Language.EN;
    const i18nArgs = {};

    const translateSpy = jest
      .spyOn(replyService, 'translate')
      .mockReturnValue('translated');

    const result = useCases.translate(key, lang, i18nArgs);

    expect(result).toEqual('translated');
    expect(translateSpy).toHaveBeenCalledWith(key, lang, i18nArgs);
  });
});
