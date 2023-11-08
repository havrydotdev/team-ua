import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import { BotException } from '../errors';

@Injectable()
export class AgePipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata) {
    const age = parseInt(value.text);

    if (isNaN(age) || age < 0) {
      throw new BotException('messages.age.invalid');
    }

    return {
      ...value,
      text: age,
    };
  }
}
