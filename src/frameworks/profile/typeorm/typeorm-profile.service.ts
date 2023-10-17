import { Injectable } from '@nestjs/common';
import {
  CreateProfileDto,
  IProfileService,
  UpdateProfileDto,
  User,
} from 'src/core';

@Injectable()
export class TypeOrmProfileService implements IProfileService {
  async createProfile(dto: CreateProfileDto): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async updateProfile(dto: UpdateProfileDto): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async deleteProfile(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async findByUser(userId: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async findRecommended(user: User, skip: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
