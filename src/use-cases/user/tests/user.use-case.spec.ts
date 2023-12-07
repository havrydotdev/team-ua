import { TestBed } from '@automock/jest';
import { createMock } from '@golevelup/ts-jest';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { IUserService } from 'src/core/abstracts';
import { CreateUserDto, UpdateUserDto } from 'src/core/dtos';
import { Profile, User } from 'src/core/entities';
import { Language } from 'src/types';

import { UserFactoryService } from '../user-factory.service';
import { UserUseCases } from '../user.use-case';

describe('UserUseCases', () => {
  let useCases: UserUseCases;
  let service: jest.Mocked<IUserService>;
  let factory: jest.Mocked<UserFactoryService>;
  let cache: jest.Mocked<Cache>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(UserUseCases).compile();

    useCases = unit;
    // @ts-expect-error - abstract class
    service = unitRef.get(IUserService);
    factory = unitRef.get(UserFactoryService);
    cache = unitRef.get(CACHE_MANAGER);
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

  describe('update', () => {
    it('should update an existing user, update cache and return it', async () => {
      const dto: UpdateUserDto = {
        id: 1,
        lang: Language.UA,
      };
      const profile = createMock<Profile>({
        user: createMock<User>({
          ...dto,
          lang: Language.EN,
        }),
      });
      const newUser = createMock<User>({
        ...profile.user,
        lang: dto.lang,
      });
      const factoryUser = createMock<User>(dto);

      const cacheSpy = jest.spyOn(cache, 'get').mockResolvedValueOnce(profile);
      const factorySpy = jest
        .spyOn(factory, 'update')
        .mockReturnValueOnce(factoryUser);
      const updateSpy = jest
        .spyOn(service, 'update')
        .mockResolvedValueOnce(profile.user);

      const result = await useCases.update(dto);

      expect(cacheSpy).toHaveBeenCalledWith('profile:1');
      expect(cache.set).toHaveBeenCalledWith(
        'profile:1',
        createMock<Profile>({
          ...profile,
          user: newUser,
        }),
      );
      expect(factorySpy).toHaveBeenCalledWith(dto);
      expect(updateSpy).toHaveBeenCalledWith(dto.id, factoryUser);
      expect(result).toEqual(profile.user);
    });
  });
});
