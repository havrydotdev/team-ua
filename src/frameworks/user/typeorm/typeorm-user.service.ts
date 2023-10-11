import { Injectable } from '@nestjs/common';
import { IUserService, User } from 'src/core';

@Injectable()
class TypeOrmUserService implements IUserService {
  async createUser(user: User): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async updateUser(user: User): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

export { TypeOrmUserService };
