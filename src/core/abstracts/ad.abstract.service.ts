import { Ad } from '../entities/ad.entity';

export abstract class IAdService {
  abstract create(ad: Ad): Promise<Ad>;

  abstract findOne(seenProfiles: number[]): Promise<Ad>;
}
