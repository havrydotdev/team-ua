class CreateProfileDto {
  userId: number;

  location: string;

  name: string;

  age: number;

  about: string;

  games: number[];
}

class UpdateProfileDto implements Partial<CreateProfileDto> {}

export { CreateProfileDto, UpdateProfileDto };
