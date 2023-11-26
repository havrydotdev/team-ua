import { Language } from 'src/types';

import { partial } from '../utils';

class CreateUserDto {
  id: number;
  lang?: Language;
}

class UpdateUserDto extends partial<Partial<CreateUserDto>>() {}

export { CreateUserDto, UpdateUserDto };
