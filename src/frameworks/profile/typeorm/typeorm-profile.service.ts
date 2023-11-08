import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IProfileService } from 'src/core/abstracts';
import { Profile } from 'src/core/entities';
import { Repository } from 'typeorm';

@Injectable()
export class TypeOrmProfileService implements IProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
  ) {}

  async createProfile(profile: Profile): Promise<Profile> {
    const res = await this.profileRepo.save(profile);

    return this.profileRepo.findOne({
      relations: {
        games: true,
      },
      where: {
        id: res.id,
      },
    });
  }

  async delete(profileId: number): Promise<void> {
    const profile = await this.findById(profileId);

    await this.profileRepo.remove(profile);
  }

  async deleteByUser(userId: number): Promise<void> {
    const profile = await this.findByUser(userId);

    await this.profileRepo.remove(profile);
  }

  async findAd(): Promise<Profile> {
    const result = await this.profileRepo
      .createQueryBuilder('profile')
      .orderBy('RANDOM()')
      .addOrderBy('profile.created_at', 'DESC')
      .limit(1)
      .getOne();

    return result;
  }

  async findById(profileId: number): Promise<Profile | undefined> {
    return this.profileRepo.findOne({
      relations: {
        games: true,
        user: true,
      },
      where: {
        id: profileId,
      },
    });
  }

  async findByUser(userId: number): Promise<Profile> {
    return this.profileRepo.findOne({
      relations: {
        games: true,
        user: true,
      },
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async findRecommended(
    profile: Profile,
    seenProfiles: number[],
  ): Promise<Profile> {
    const result = await this.profileRepo
      .createQueryBuilder('profile')
      .orderBy('RANDOM()')
      .addOrderBy('profile.age - :age', 'ASC', 'NULLS LAST')
      .setParameter('age', profile.age)
      .addOrderBy('profile.created_at', 'DESC')
      .leftJoinAndSelect('profile.games', 'game')
      .leftJoinAndSelect('profile.user', 'user')
      .where('user.id IS NOT NULL')
      .andWhere('profile.id NOT IN (:...seenProfiles)', {
        seenProfiles: [...seenProfiles, profile.id],
      })
      .limit(1)
      .getOne();

    return result;
  }

  async updateProfile(profileId: number, profile: Profile): Promise<Profile> {
    return this.profileRepo.save({
      id: profileId,
      ...profile,
    });
  }
}
