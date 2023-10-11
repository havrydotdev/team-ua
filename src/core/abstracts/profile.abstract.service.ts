import { CreateProfileDto, UpdateProfileDto } from '../dtos';
import { User } from '../entities';

abstract class IProfileService {
  abstract createProfile(dto: CreateProfileDto): Promise<void>;

  abstract updateProfile(dto: UpdateProfileDto): Promise<void>;

  abstract deleteProfile(id: number): Promise<void>;

  abstract findByUser(userId: number): Promise<void>;

  abstract findRecommended(user: User): Promise<void>;
}

export { IProfileService };
