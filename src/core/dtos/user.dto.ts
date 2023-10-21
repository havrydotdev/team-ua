import { partial } from '../utils';

class CreateUserDto {
  chatId: number;
  userId: number;
}

class UpdateUserDto extends partial<Partial<CreateUserDto>>() {}

export { CreateUserDto, UpdateUserDto };
