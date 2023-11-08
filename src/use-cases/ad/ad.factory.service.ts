import { Injectable } from '@nestjs/common';
import { CreateAdDto } from 'src/core/dtos/ad.dto';
import { Ad } from 'src/core/entities';

@Injectable()
export class AdFactoryService {
  create(dto: CreateAdDto) {
    return Ad.create({
      ...dto,
    });
  }
}
