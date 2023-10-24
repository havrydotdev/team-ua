import { User } from '../entities';

abstract class IUserService {
  abstract create(user: User): Promise<User>;

  abstract update(userId: number, user: User): Promise<User>;

  abstract findById(userId: number): Promise<User | null>;
}

export { IUserService };
