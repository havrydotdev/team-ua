import { createMock } from '@golevelup/ts-jest';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IUserService } from 'src/core/abstracts';
import { CreateUserDto, UpdateUserDto } from 'src/core/dtos';
import { User } from 'src/core/entities';
import { TypeOrmUserService } from 'src/frameworks/user/typeorm/typeorm-user.service';
import { MockDatabaseModule } from 'src/services/mock-database/mock-database.module';
import { UserFactoryService } from '../user-factory.service';
import { UserUseCases } from '../user.use-case';

describe('UserUseCases', () => {
  let useCases: UserUseCases;
  let service: IUserService;
  let factory: UserFactoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MockDatabaseModule,
        TypeOrmModule.forFeature([User]),
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
      providers: [
        UserUseCases,
        UserFactoryService,
        {
          provide: IUserService,
          useClass: TypeOrmUserService,
        },
      ],
    }).compile();

    useCases = module.get<UserUseCases>(UserUseCases);
    service = module.get<IUserService>(IUserService);
    factory = module.get<UserFactoryService>(UserFactoryService);
  });

  describe('create', () => {
    it('should create a new user and return it', async () => {
      const dto: CreateUserDto = { chatId: 123, userId: 312321 };
      const user: User = createMock<User>({
        ...dto,
      });

      const factorySpy = jest
        .spyOn(factory, 'create')
        .mockReturnValueOnce(user);
      const createSpy = jest
        .spyOn(service, 'create')
        .mockImplementationOnce(async () => user);

      const result = await useCases.create(dto);

      expect(factorySpy).toHaveBeenCalledWith(dto);
      expect(createSpy).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });
  });

  describe('update', () => {
    it('should update an existing user and return it', async () => {
      const dto: UpdateUserDto = { chatId: 123, userId: 312321 };
      const user: User = createMock<User>({
        ...dto,
      });

      jest.spyOn(factory, 'update').mockReturnValueOnce(user);
      jest.spyOn(service, 'update').mockImplementationOnce(async () => user);

      const result = await useCases.update(user.id, dto);

      expect(factory.update).toHaveBeenCalledWith(dto);
      expect(service.update).toHaveBeenCalledWith(user.id, user);
      expect(result).toEqual(user);
    });
  });

  describe('getByTgId', () => {
    it('should return a user by their Telegram ID', async () => {
      const user: User = createMock<User>({
        chatId: 12345,
      });

      jest
        .spyOn(service, 'findByTgId')
        .mockImplementationOnce(async () => user);

      const result = await useCases.getByTgId(user.chatId);

      expect(service.findByTgId).toHaveBeenCalledWith(user.chatId);
      expect(result).toEqual(user);
    });
  });
});
