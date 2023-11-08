import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { MessageContext } from 'src/types';
import { UserUseCases } from 'src/use-cases/user';

import { Roles } from '../decorators';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly userUseCases: UserUseCases,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>(Roles, context.getHandler());
    if (!roles || roles.length === 0) {
      return true;
    }

    const ctx = TelegrafExecutionContext.create(context);
    const { from } = ctx.getContext<MessageContext>();

    const user = await this.userUseCases.findById(from.id);

    return roles.includes(user.role);
  }
}
