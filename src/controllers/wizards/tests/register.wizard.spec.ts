import { Test, TestingModule } from '@nestjs/testing';
import { RegisterWizard } from 'src/controllers/wizards/register.wizard';
import { GameUseCases } from 'src/use-cases/game';
import { ReplyUseCases } from 'src/use-cases/reply';
import { WizardMessageContext } from 'src/types/telegraf';
import { Game } from 'src/core';
import { MockDatabaseModule } from 'src/services/mock-database/mock-database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserUseCases } from 'src/use-cases/user';
import { FileUseCases } from 'src/use-cases/file';
import { ProfileUseCases } from 'src/use-cases/profile';
import {
  getGamesMarkup,
  getNameMarkup,
  getRemoveKeyboardMarkup,
} from 'src/core/utils';

const testGames = [
  {
    id: 1,
    title: 'game1',
  },
  {
    id: 2,
    title: 'game2',
  },
  {
    id: 3,
    title: 'game3',
  },
];

describe('RegisterWizard', () => {
  let wizard: RegisterWizard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MockDatabaseModule, TypeOrmModule.forFeature([Game])],
      providers: [
        RegisterWizard,
        {
          provide: GameUseCases,
          useValue: {
            findAll: jest.fn().mockResolvedValue(testGames),
          },
        },
        {
          provide: ReplyUseCases,
          useValue: {
            enterName: jest.fn(),
            enterAge: jest.fn(),
            sendLocation: jest.fn(),
            invalidAge: jest.fn(),
            sendGames: jest.fn(),
            gameAdded: jest.fn(),
            invalidGame: jest.fn(),
            sendPicture: jest.fn(),
          },
        },
        {
          provide: UserUseCases,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: FileUseCases,
          useValue: {
            upload: jest.fn(),
          },
        },
        {
          provide: ProfileUseCases,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    wizard = module.get<RegisterWizard>(RegisterWizard);
  });

  describe('onEnter', () => {
    it('should call enterName on the reply use cases and go to the next step', async () => {
      const ctx = {
        wizard: {
          next: jest.fn(),
        },
        from: {
          first_name: 'John',
        },
      } as unknown as WizardMessageContext;

      const resp = await wizard.onEnter(ctx);

      expect(resp).toEqual([
        ['messages.new_user', 'messages.enter_name'],
        [{}, { reply_markup: getNameMarkup(ctx.from.first_name) }],
      ]);
      expect(ctx.wizard.next).toHaveBeenCalled();
    });
  });

  describe('onName', () => {
    it('should set the name state and go to the next step', async () => {
      const ctx = {
        wizard: {
          state: {},
          next: jest.fn(),
        },
      } as unknown as WizardMessageContext;
      const msg = { text: 'name' };

      const resp = await wizard.onName(ctx, msg);

      expect(ctx.wizard.state['name']).toEqual(msg.text);
      expect(resp).toEqual('messages.enter_age');
      expect(ctx.wizard.next).toHaveBeenCalled();
    });
  });

  describe('onAge', () => {
    it('should call enterAge on the reply use cases and go to the next step', async () => {
      const ctx = {
        wizard: {
          next: jest.fn(),
          state: {},
        },
      } as unknown as WizardMessageContext;

      const resp = await wizard.onAge(ctx, { text: '17' });

      expect(resp).toEqual('messages.send_location');
      expect(ctx.wizard.state.age).toEqual(17);
      expect(ctx.wizard.next).toHaveBeenCalled();
    });

    it('should return error message if age is not a number', async () => {
      const ctx = {
        wizard: {
          next: jest.fn(),
          state: {},
        },
      } as unknown as WizardMessageContext;

      const resp = await wizard.onAge(ctx, { text: 'invalid age' });

      expect(resp).toEqual('messages.invalid_age');
      expect(ctx.wizard.next).not.toHaveBeenCalled();
      expect(ctx.wizard.state.age).toEqual(undefined);
    });
  });

  describe('onLocation', () => {
    it('should set the location state and go to the next step', async () => {
      const ctx = {
        wizard: {
          next: jest.fn(),
          state: {},
        },
      } as unknown as WizardMessageContext;

      const msg = { text: 'Kharkiv' };

      const resp = await wizard.onLocation(ctx, msg);

      expect(ctx.wizard.state.location).toEqual(msg.text);
      expect(ctx.wizard.next).toHaveBeenCalled();
      expect(resp).toEqual([
        'messages.send_games',
        {
          reply_markup: getGamesMarkup(testGames as Game[]),
        },
      ]);
    });
  });

  describe('onGame', () => {
    it('should set the games state', async () => {
      const ctx = {
        wizard: {
          next: jest.fn(),
          state: {},
        },
      } as unknown as WizardMessageContext;
      const msg = { text: 'game1' };

      const resp = await wizard.onGame(ctx, msg);

      expect(ctx.wizard.state.games).toEqual([1]);
      expect(ctx.wizard.next).not.toHaveBeenCalled();
      expect(resp).toEqual('messages.game_added');
    });

    it('should go to the next step if the game is not in the list', async () => {
      const ctx = {
        wizard: {
          next: jest.fn(),
          state: {},
        },
      } as unknown as WizardMessageContext;
      const msg = { text: 'game4' };

      const resp = await wizard.onGame(ctx, msg);

      expect(ctx.wizard.state['games']).toEqual(undefined);
      expect(ctx.wizard.next).not.toHaveBeenCalled();
      expect(resp).toEqual('messages.invalid_game');
    });

    it('should send error message if game is already in state', async () => {
      const ctx = {
        wizard: {
          next: jest.fn(),
          state: {
            games: [1],
          },
        },
      } as unknown as WizardMessageContext;
      const msg = { text: 'game1' };

      const resp = await wizard.onGame(ctx, msg);

      expect(ctx.wizard.state['games']).toEqual([1]);
      expect(ctx.wizard.next).not.toHaveBeenCalled();
      expect(resp).toEqual('messages.invalid_game');
    });

    it('should go to the next step if the message is ✅', async () => {
      const ctx = {
        wizard: {
          next: jest.fn(),
          state: {},
        },
      } as unknown as WizardMessageContext;
      const msg = { text: '✅' };

      const resp = await wizard.onGame(ctx, msg);

      expect(ctx.wizard.state['games']).toEqual(undefined);
      expect(ctx.wizard.next).toHaveBeenCalled();
      expect(resp).toEqual([
        'messages.send_picture',
        {
          reply_markup: getRemoveKeyboardMarkup(),
        },
      ]);
    });
  });
});
