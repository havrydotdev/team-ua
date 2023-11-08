import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IAdService } from 'src/core/abstracts';
import { Ad } from 'src/core/entities';
import { In, Not, Repository } from 'typeorm';

// TODO: add expiration date for ads
@Injectable()
export class TypeOrmAdService implements IAdService {
  constructor(@InjectRepository(Ad) private readonly adRepo: Repository<Ad>) {}

  async create(ad: Ad): Promise<Ad> {
    return this.adRepo.save(ad);
  }

  async findOne(seenProfiles: number[]): Promise<Ad> {
    return this.adRepo.findOne({
      where: {
        id: Not(In(seenProfiles)),
      },
    });
  }
}
