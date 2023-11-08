import { Injectable } from '@nestjs/common';
import { IAdService } from 'src/core/abstracts';
import { CreateAdDto } from 'src/core/dtos/ad.dto';
import { Ad } from 'src/core/entities';

import { AdFactoryService } from './ad.factory.service';

@Injectable()
export class AdUseCases {
  constructor(
    private readonly adService: IAdService,
    private readonly adFactory: AdFactoryService,
  ) {}

  async create(dto: CreateAdDto): Promise<Ad> {
    const ad = this.adFactory.create(dto);

    return this.adService.create(ad);
  }

  async findOne(seenProfiles: number[]): Promise<Ad> {
    return this.adService.findOne(seenProfiles);
  }
}
