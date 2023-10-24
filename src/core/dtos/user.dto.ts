import { partial } from '../utils';

class CreateUserDto {
  id: number;
}

class UpdateUserDto extends partial<Partial<CreateUserDto>>() {}

export { CreateUserDto, UpdateUserDto };
