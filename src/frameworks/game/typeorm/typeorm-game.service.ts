import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IGameService } from 'src/core/abstracts/game.abstract.service';
import { Game } from 'src/core/entities';
import { Repository } from 'typeorm';

@Injectable()
export class TypeOrmGameService implements IGameService {
  constructor(
    @InjectRepository(Game) private readonly gameRepo: Repository<Game>,
  ) {}

  async findAll(): Promise<Game[]> {
    return this.gameRepo.find({
      order: {
        created_at: 'DESC',
      },
    });
  }

  async findByTitle(title: string): Promise<Game | null> {
    return this.gameRepo.findOne({
      where: {
        title,
      },
    });
  }

  async findStartsWith(title: string): Promise<Game[]> {
    return this.gameRepo
      .createQueryBuilder('game')
      .select()
      .addSelect('COUNT(profile.id) as profilesCount')
      .where('game.title LIKE :title', { title: `%${title}%` })
      .leftJoin('game.profiles', 'profile')
      .groupBy('game.id')
      .orderBy('profilesCount', 'DESC')
      .addOrderBy('game.created_at', 'DESC')
      .limit(20)
      .getMany();
  }

  async findWithLimit(limit: number): Promise<Game[]> {
    return this.gameRepo.find({
      order: {
        created_at: 'DESC',
      },
      take: limit,
    });
  }
}
