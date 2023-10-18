import { Injectable } from '@nestjs/common';
import { CreateProfileDto, Profile, UpdateProfileDto } from 'src/core';

@Injectable()
export class ProfileFactoryService {
  create(dto: CreateProfileDto): Profile {
    return Profile.create({
      ...dto,
      user: {
        id: dto.userId,
      },
      games: dto.games.map((gameId) => ({ id: gameId })),
    });
  }

  update(dto: UpdateProfileDto): Profile {
    return Profile.create({
      ...dto,
      user: {
        id: dto.userId,
      },
      games: dto.games.map((gameId) => ({ id: gameId })),
    });
  }
}
