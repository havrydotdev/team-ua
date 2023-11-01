import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto, UpdateUserDto } from 'src/core/dtos';
import { User } from 'src/core/entities';
import { UserFactoryService } from '../user-factory.service';

describe('UserFactoryService', () => {
  let service: UserFactoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserFactoryService],
    }).compile();

    service = module.get<UserFactoryService>(UserFactoryService);
  });

  describe('create', () => {
    it('should create a new user with the provided data', () => {
      const dto: CreateUserDto = {
        id: 12345,
      };
      const user = createMock<User>({
        ...dto,
      });
      const createSpy = jest.spyOn(User, 'create').mockReturnValue(user);

      const result = service.create(dto);

      expect(createSpy).toHaveBeenCalledWith(dto);
      expect(result).toEqual(user);
    });
  });

  describe('update', () => {
    it('should create a new user with the provided data', () => {
      const dto: UpdateUserDto = {
        id: 12345,
      };
      const user = createMock<User>({
        ...dto,
      });
      const createSpy = jest.spyOn(User, 'create').mockReturnValue(user);

      const result = service.update(dto);

      expect(createSpy).toHaveBeenCalledWith(dto);
      expect(result).toEqual(user);
    });
  });
});
