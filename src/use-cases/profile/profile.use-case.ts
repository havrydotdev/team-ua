import { Injectable } from '@nestjs/common';
import { IProfileService } from 'src/core/abstracts';
import { CreateProfileDto } from 'src/core/dtos';
import { ProfileFactoryService } from './profile-factory.service';

@Injectable()
export class ProfileUseCases {
  constructor(
    private readonly profileService: IProfileService,
    private readonly profileFactory: ProfileFactoryService,
  ) {}

  async findByUser(userId: number) {
    return this.profileService.findByUser(userId);
  }

  async create(dto: CreateProfileDto) {
    const profile = this.profileFactory.create(dto);

    return this.profileService.createProfile(profile);
  }

  async updateProfile(profileId: number, dto: CreateProfileDto) {
    const profile = this.profileFactory.update(dto);

    return this.profileService.updateProfile(profileId, profile);
  }

  async deleteProfile(profileId: number) {
    return this.profileService.deleteProfile(profileId);
  }

  async findRecommended(userId: number, skip: number) {
    const profile = await this.profileService.findByUser(userId);

    return this.profileService.findRecommended(profile, skip);
  }
}
