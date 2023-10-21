import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IProfileService, Profile } from 'src/core';
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
    const res = await this.profileRepo.insert(profile);
    return this.profileRepo.findOne({
      where: {
        id: res.identifiers[0].id,
      },
      relations: {
        file: true,
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

  // TODO
  async findRecommended(user: Profile, skip: number): Promise<Profile> {
    const result = await this.profileRepo.find({
      skip,
      take: 1,
      order: {},
    });

    return result[0];
  }
}
