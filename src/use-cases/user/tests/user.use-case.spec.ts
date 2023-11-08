import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { IUserService } from 'src/core/abstracts';
import { CreateUserDto } from 'src/core/dtos';
import { User } from 'src/core/entities';
import { TypeOrmUserService } from 'src/frameworks/user/typeorm/typeorm-user.service';

import { UserFactoryService } from '../user-factory.service';
import { UserUseCases } from '../user.use-case';

describe('UserUseCases', () => {
  let useCases: UserUseCases;
  let service: IUserService;
  let factory: UserFactoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserUseCases,
        UserFactoryService,
        {
          provide: IUserService,
          useValue: createMock<TypeOrmUserService>(),
        },
      ],
    }).compile();

    useCases = module.get<UserUseCases>(UserUseCases);
    service = module.get<IUserService>(IUserService);
    factory = module.get<UserFactoryService>(UserFactoryService);
  });

  describe('create', () => {
    it('should create a new user and return it', async () => {
      const dto: CreateUserDto = { id: 12345 };
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

  describe('findById', () => {
    it('should find an existing user and return it', async () => {
      const id = 12345;
      const user: User = createMock<User>({
        id,
      });

      const findSpy = jest
        .spyOn(service, 'findById')
        .mockImplementationOnce(async () => user);

      const result = await useCases.findById(id);

      expect(findSpy).toHaveBeenCalledWith(id);
      expect(result).toEqual(user);
    });
  });
});
