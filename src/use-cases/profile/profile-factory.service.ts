import { Injectable } from '@nestjs/common';
import { CreateProfileDto, UpdateProfileDto } from 'src/core/dtos';
import { Game, Profile } from 'src/core/entities';

@Injectable()
export class ProfileFactoryService {
  create(dto: CreateProfileDto): Profile {
    return Profile.create({
      ...dto,
      fileId: dto.fileId,
      games: dto.games.map((gameId) => Game.create({ id: gameId })),
      user: {
        id: dto.userId,
      },
    });
  }

  update(dto: UpdateProfileDto): Profile {
    return Profile.create({
      ...dto,
      fileId: dto.fileId,
      games: dto.games.map((gameId) => ({ id: gameId })),
      user: {
        id: dto.userId,
      },
    });
  }
}
