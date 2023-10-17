import { Context } from 'telegraf';
import { ReplyUseCases } from '../reply.use-case';

// TODO: di
describe('ReplyUseCases', () => {
  let useCases: ReplyUseCases;
  let ctx: Context;

  beforeEach(() => {
    useCases = new ReplyUseCases();
    ctx = {} as Context;
  });

  describe('enterName', () => {
    it('should send enter_name message with resize_keyboard and one_time_keyboard options', async () => {
      const replySpy = spyOn(useCases.replyService, 'reply');
      await useCases.enterName(ctx);
      expect(replySpy).toHaveBeenCalledWith(ctx, 'messages.enter_name', {
        reply_markup: {
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      });
    });
  });

  describe('enterAge', () => {
    it('should send enter_age message', async () => {
      const replySpy = spyOn(useCases.replyService, 'reply');
      await useCases.enterAge(ctx);
      expect(replySpy).toHaveBeenCalledWith(ctx, 'messages.enter_age');
    });
  });

  describe('invalidAge', () => {
    it('should send invalid_age message', async () => {
      const replySpy = spyOn(useCases.replyService, 'reply');
      await useCases.invalidAge(ctx);
      expect(replySpy).toHaveBeenCalledWith(ctx, 'messages.invalid_age');
    });
  });

  describe('sendLocation', () => {
    it('should send send_location message', async () => {
      const replySpy = spyOn(useCases.replyService, 'reply');
      await useCases.sendLocation(ctx);
      expect(replySpy).toHaveBeenCalledWith(ctx, 'messages.send_location');
    });
  });

  describe('sendPicture', () => {
    it('should send send_picture message', async () => {
      const replySpy = spyOn(useCases.replyService, 'reply');
      await useCases.sendPicture(ctx);
      expect(replySpy).toHaveBeenCalledWith(ctx, 'messages.send_picture');
    });
  });

  describe('sendGames', () => {
    it('should send send_games message', async () => {
      const replySpy = spyOn(useCases.replyService, 'reply');
      await useCases.sendGames(ctx);
      expect(replySpy).toHaveBeenCalledWith(ctx, 'messages.send_games');
    });
  });

  describe('invalidGame', () => {
    it('should send invalid_game message', async () => {
      const replySpy = spyOn(useCases.replyService, 'reply');
      await useCases.invalidGame(ctx);
      expect(replySpy).toHaveBeenCalledWith(ctx, 'messages.invalid_game');
    });
  });
});
