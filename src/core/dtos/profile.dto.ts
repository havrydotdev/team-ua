import { partial } from '../utils';

class CreateProfileDto {
  about: string;

  age: number;

  fileId: string;

  games: number[];

  name: string;

  userId: number;
}

class UpdateProfileDto extends partial<Partial<CreateProfileDto>>() {}

export { CreateProfileDto, UpdateProfileDto };
