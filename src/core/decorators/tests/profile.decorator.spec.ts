import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { TelegrafExecutionContext } from 'nestjs-telegraf';
import { User } from 'src/core/entities';

import { ReqUser } from '../profile.decorator';

// eslint-disable-next-line @typescript-eslint/ban-types
function getParamDecoratorFactory(decorator: Function) {
  class Test {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public test(@decorator() value) {}
  }

  const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, 'test');
  return args[Object.keys(args)[0]].factory;
}

describe('ReqUser', () => {
  it('should return the user from the request', () => {
    const user = createMock<User>({
      id: 1,
    });

    jest.spyOn(TelegrafExecutionContext, 'create').mockReturnValue(
      createMock<TelegrafExecutionContext>({
        switchToHttp: () => ({
          getRequest: () => ({ user }),
        }),
      }),
    );

    const factory = getParamDecoratorFactory(ReqUser);
    const result = factory(null, createMock<ExecutionContext>());

    expect(result).toEqual(user);
  });
});
