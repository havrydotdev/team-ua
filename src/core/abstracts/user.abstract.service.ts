import { User } from '../entities';

abstract class IUserService {
  abstract create(user: User): Promise<User>;

  abstract update(userId: number, user: User): Promise<User>;

  abstract findByTgId(tgId: number): Promise<User>;
}

export { IUserService };
