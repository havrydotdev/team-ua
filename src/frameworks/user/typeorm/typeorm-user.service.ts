import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUserService } from 'src/core/abstracts';
import { User } from 'src/core/entities';
import { Repository } from 'typeorm';

@Injectable()
class TypeOrmUserService implements IUserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}
  async create(user: User): Promise<User> {
    return this.userRepo.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find({
      relations: {
        profile: true,
      },
    });
  }

  async findById(userId: number): Promise<null | User> {
    return this.userRepo.findOne({
      relations: {
        profile: {
          games: true,
          user: true,
        },
      },
      where: {
        id: userId,
      },
    });
  }

  async update(userId: number, user: User): Promise<User> {
    await this.userRepo.update(userId, user);

    return this.userRepo.findOneBy({
      id: user.id,
    });
  }
}

export { TypeOrmUserService };
