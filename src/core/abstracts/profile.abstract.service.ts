import { Profile } from '../entities';

abstract class IProfileService {
  abstract createProfile(profile: Profile): Promise<Profile>;

  abstract delete(profileId: number): Promise<void>;

  abstract deleteByUser(userId: number): Promise<void>;

  abstract findAll(): Promise<Profile[]>;

  abstract findById(profileId: number): Promise<Profile | undefined>;

  abstract findByUser(userId: number): Promise<Profile>;

  abstract findRecommended(
    user: Profile,
    seenProfiles: number[],
  ): Promise<Profile>;

  abstract updateProfile(profileId: number, profile: Profile): Promise<Profile>;
}

export { IProfileService };
