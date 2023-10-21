import { partial } from '../utils';

class CreateProfileDto {
  userId: number;

  location: string;

  name: string;

  age: number;

  about: string;

  games: number[];

  fileId: number;
}

class UpdateProfileDto extends partial<Partial<CreateProfileDto>>() {}

export { CreateProfileDto, UpdateProfileDto };
