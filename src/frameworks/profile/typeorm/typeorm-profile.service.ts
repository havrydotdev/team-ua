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

  async findByUser(userId: number): Promise<Profile> {
    return this.profileRepo.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async createProfile(profile: Profile): Promise<Profile> {
    const res = await this.profileRepo.save(profile);

    return this.profileRepo.findOne({
      where: {
        id: res.id,
      },
      relations: {
        file: true,
        games: true,
      },
    });
  }

  async updateProfile(profileId: number, profile: Profile): Promise<Profile> {
    return await this.profileRepo.save({
      id: profileId,
      ...profile,
    });
  }

  async deleteProfile(profileId: number): Promise<void> {
    await this.profileRepo.delete(profileId);
  }

  async findRecommended(profile: Profile): Promise<Profile> {
    const result = await this.profileRepo
      .createQueryBuilder('profile')
      .where('profile.id != :id', { id: profile.id })
      .orderBy('RANDOM()')
      .addOrderBy('profile.age - :age', 'ASC', 'NULLS LAST')
      .setParameter('age', profile.age)
      .addOrderBy('profile.created_at', 'DESC')
      .leftJoinAndSelect('profile.games', 'game')
      .leftJoinAndSelect('profile.file', 'file')
      .leftJoinAndSelect('profile.user', 'user')
      .andWhere('user.id IS NOT NULL')
      .limit(1)
      .getOne();

    return result;
  }
}
