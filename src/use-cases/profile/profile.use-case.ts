import { Injectable } from '@nestjs/common';
import { IProfileService } from 'src/core/abstracts';
import { CreateProfileDto } from 'src/core/dtos';
import { Profile } from 'src/core/entities';

import { AdUseCases } from '../ad';
import { ProfileFactoryService } from './profile-factory.service';

@Injectable()
export class ProfileUseCases {
  constructor(
    private readonly profileService: IProfileService,
    private readonly profileFactory: ProfileFactoryService,
    private readonly adUseCases: AdUseCases,
  ) {}

  async create(dto: CreateProfileDto) {
    const profile = this.profileFactory.create(dto);

    return this.profileService.createProfile(profile);
  }

  async deleteByUser(userId: number) {
    return this.profileService.deleteByUser(userId);
  }

  async findAll(): Promise<Profile[]> {
    return this.profileService.findAll();
  }

  async findRecommended(
    profile: Profile,
    seenProfiles: number[],
  ): Promise<Profile> {
    return this.profileService.findRecommended(profile, seenProfiles ?? []);
  }

  async update(profileId: number, dto: CreateProfileDto) {
    const profile = this.profileFactory.update(dto);

    return this.profileService.updateProfile(profileId, profile);
  }
}
