import { Profile } from '../entities';

abstract class IProfileService {
  abstract createProfile(profile: Profile): Promise<Profile>;

  abstract updateProfile(profileId: number, profile: Profile): Promise<Profile>;

  abstract deleteProfile(profileId: number): Promise<void>;

  abstract findByUser(userId: number): Promise<Profile>;

  abstract findRecommended(user: Profile, skip: number): Promise<Profile>;
}

export { IProfileService };
