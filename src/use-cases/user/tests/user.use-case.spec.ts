import { CreateUserDto, IUserService, User } from 'src/core';
import { UserUseCases } from '../user.use-case';
import { UserFactoryService } from '../user-factory.service';

// TODO: refactor
describe('UserUseCases', () => {
  let userUseCases: UserUseCases;
  let userService: IUserService;
  let userFactory: UserFactoryService;

  beforeEach(() => {
    userService = {} as IUserService;
    userFactory = {} as UserFactoryService;
    userUseCases = new UserUseCases(userService, userFactory);
  });

  describe('create', () => {
    it('should create a new user and return it', async () => {
      const dto: CreateUserDto = { name: 'John Doe', age: 30 };
      const user: User = { id: 1, name: 'John Doe', age: 30 };
      spyOn(userFactory, 'create').and.returnValue(user);
      spyOn(userService, 'create').and.returnValue(user);
      const result = await userUseCases.create(dto);
      expect(userFactory.create).toHaveBeenCalledWith(dto);
      expect(userService.create).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });
  });

  describe('update', () => {
    it('should update an existing user and return it', async () => {
      const userId = 1;
      const dto: UpdateUserDto = { name: 'Jane Doe', age: 35 };
      const user: User = { id: 1, name: 'Jane Doe', age: 35 };
      spyOn(userFactory, 'update').and.returnValue(user);
      spyOn(userService, 'update').and.returnValue(user);
      const result = await userUseCases.update(userId, dto);
      expect(userFactory.update).toHaveBeenCalledWith(dto);
      expect(userService.update).toHaveBeenCalledWith(userId, user);
      expect(result).toEqual(user);
    });
  });

  describe('getByTgId', () => {
    it('should return a user by their Telegram ID', async () => {
      const tgId = 12345;
      const user: User = { id: 1, name: 'John Doe', age: 30 };
      spyOn(userService, 'findByTgId').and.returnValue(user);
      const result = await userUseCases.getByTgId(tgId);
      expect(userService.findByTgId).toHaveBeenCalledWith(tgId);
      expect(result).toEqual(user);
    });
  });
});
