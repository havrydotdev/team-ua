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

  async findByTgId(tgId: number): Promise<User> {
    return this.userRepo.findOne({ where: { userId: tgId } });
  }

  async create(user: User): Promise<User> {
    return this.userRepo.save(user);
  }

  async update(userId: number, user: User): Promise<User> {
    await this.userRepo.update(userId, user);

    return this.userRepo.findOneBy({
      id: user.id,
    });
  }
}

export { TypeOrmUserService };
