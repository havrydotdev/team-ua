import { CreateUserDto, IUserService, UpdateUserDto, User } from 'src/core';
import { UserUseCases } from '../user.use-case';
import { UserFactoryService } from '../user-factory.service';
import { TypeOrmUserService } from 'src/frameworks/user/typeorm/typeorm-user.service';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { MockDatabaseModule } from 'src/services/mock-database/mock-database.module';
import { TypeOrmModule } from '@nestjs/typeorm';

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
      const user: User = User.create({
        ...dto,
      });

      jest.spyOn(factory, 'create').mockReturnValueOnce(user);
      jest.spyOn(service, 'create').mockImplementationOnce(async () => user);

      const result = await useCases.create(dto);

      expect(factory.create).toHaveBeenCalledWith(dto);
      expect(service.create).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });
  });

  describe('update', () => {
    it('should update an existing user and return it', async () => {
      const userId = 1;
      const dto: UpdateUserDto = { chatId: 123, userId: 312321 };
      const user: User = User.create({
        ...dto,
      });

      jest.spyOn(factory, 'update').mockReturnValueOnce(user);
      jest.spyOn(service, 'update').mockImplementationOnce(async () => user);

      const result = await useCases.update(userId, dto);

      expect(factory.update).toHaveBeenCalledWith(dto);
      expect(service.update).toHaveBeenCalledWith(userId, user);
      expect(result).toEqual(user);
    });
  });

  describe('getByTgId', () => {
    it('should return a user by their Telegram ID', async () => {
      const chatId = 12345;
      const user: User = User.create({
        chatId,
      });

      jest
        .spyOn(service, 'findByTgId')
        .mockImplementationOnce(async () => user);

      const result = await useCases.getByTgId(chatId);

      expect(service.findByTgId).toHaveBeenCalledWith(chatId);
      expect(result).toEqual(user);
    });
  });
});
