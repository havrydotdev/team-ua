import { autoImplement } from '../utils';

class CreateProfileDto {
  userId: number;

  location: string;

  name: string;

  age: number;

  about: string;

  games: number[];
}

class UpdateProfileDto extends autoImplement<Partial<CreateProfileDto>>() {}

export { CreateProfileDto, UpdateProfileDto };
