import { Profile } from '../entities';

abstract class IProfileService {
  abstract createProfile(profile: Profile): Promise<void>;

  abstract updateProfile(profileId: number, profile: Profile): Promise<void>;

  abstract deleteProfile(profileId: number): Promise<void>;

  abstract findByUser(userId: number): Promise<Profile>;

  abstract findRecommended(user: Profile, skip: number): Promise<void>;
}

export { IProfileService };
