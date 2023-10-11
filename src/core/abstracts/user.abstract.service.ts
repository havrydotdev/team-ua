import { User } from '../entities';

abstract class IUserService {
  abstract createUser(user: User): Promise<void>;

  abstract updateUser(user: User): Promise<void>;
}

export { IUserService };
