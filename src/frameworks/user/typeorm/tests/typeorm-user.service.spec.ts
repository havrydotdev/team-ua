import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/core/entities';
import { MockDatabaseModule } from 'src/services/mock-database/mock-database.module';
import { Repository } from 'typeorm';
import { TypeOrmUserService } from '../typeorm-user.service';

describe('TypeOrmUserService', () => {
  let service: TypeOrmUserService;
  let repo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MockDatabaseModule, TypeOrmModule.forFeature([User])],
      providers: [TypeOrmUserService],
    }).compile();

    service = module.get<TypeOrmUserService>(TypeOrmUserService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should return a user for a given Telegram ID', async () => {
    const tgId = 123;
    const user = User.create();
    jest.spyOn(repo, 'findOne').mockResolvedValue(user);

    const result = await service.findByTgId(tgId);

    expect(result).toEqual(user);
    expect(repo.findOne).toHaveBeenCalledWith({
      where: {
        userId: tgId,
      },
    });
  });

  it('should create a user', async () => {
    const user = User.create();
    jest.spyOn(repo, 'save').mockResolvedValue(user);

    const result = await service.create(user);

    expect(result).toEqual(user);
    expect(repo.save).toHaveBeenCalledWith(user);
  });

  it('should update a user', async () => {
    const userId = 1;
    const user = User.create();
    jest
      .spyOn(repo, 'update')
      .mockImplementationOnce(() => Promise.resolve(undefined));
    jest.spyOn(repo, 'findOneBy').mockResolvedValue(user);

    const result = await service.update(userId, user);

    expect(result).toEqual(user);
    expect(repo.update).toHaveBeenCalledWith(userId, user);
    expect(repo.findOneBy).toHaveBeenCalledWith({
      id: user.id,
    });
  });
});
