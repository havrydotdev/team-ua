import { Injectable } from '@nestjs/common';
import { CreateProfileDto, UpdateProfileDto } from 'src/core/dtos';
import { Profile } from 'src/core/entities';

@Injectable()
export class ProfileFactoryService {
  create(dto: CreateProfileDto): Profile {
    return Profile.create({
      ...dto,
      user: {
        id: dto.userId,
      },
      games: dto.games.map((gameId) => ({ id: gameId })),
      file: {
        id: dto.fileId,
      },
    });
  }

  update(dto: UpdateProfileDto): Profile {
    return Profile.create({
      ...dto,
      user: {
        id: dto.userId,
      },
      games: dto.games.map((gameId) => ({ id: gameId })),
      file: {
        id: dto.fileId,
      },
    });
  }
}
