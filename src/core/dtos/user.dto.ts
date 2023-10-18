import { autoImplement } from '../utils';

class CreateUserDto {
  chatId: number;
  userId: number;
}

class UpdateUserDto extends autoImplement<Partial<CreateUserDto>>() {}

export { CreateUserDto, UpdateUserDto };
