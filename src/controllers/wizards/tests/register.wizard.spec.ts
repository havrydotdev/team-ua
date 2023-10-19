import { Test, TestingModule } from '@nestjs/testing';
import { RegisterWizard } from 'src/controllers/wizards/register.wizard';
import { GameUseCases } from 'src/use-cases/game';
import { ReplyUseCases } from 'src/use-cases/reply';
import { WizardMessageContext } from 'src/types/telegraf';
import { Game } from 'src/core';
import { MockDatabaseModule } from 'src/services/mock-database/mock-database.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('RegisterWizard', () => {
  let wizard: RegisterWizard;
  let replyUseCases: ReplyUseCases;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MockDatabaseModule, TypeOrmModule.forFeature([Game])],
      providers: [
        RegisterWizard,
        {
          provide: GameUseCases,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: ReplyUseCases,
          useValue: {
            enterName: jest.fn(),
            enterAge: jest.fn(),
          },
        },
      ],
    }).compile();

    wizard = module.get<RegisterWizard>(RegisterWizard);
    replyUseCases = module.get<ReplyUseCases>(ReplyUseCases);
  });

  describe('onEnter', () => {
    it('should call enterName on the reply use cases and go to the next step', async () => {
      const ctx = {
        wizard: {
          next: jest.fn(),
        },
      } as unknown as WizardMessageContext;

      await wizard.onEnter(ctx);

      expect(replyUseCases.enterName).toHaveBeenCalledWith(ctx);
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

      await wizard.onName(ctx, msg);

      expect(ctx.wizard.state['name']).toEqual(msg.text);
      expect(ctx.wizard.next).toHaveBeenCalled();
    });
  });
});
