import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import { BotException } from '../errors';

@Injectable()
export class AboutPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata) {
    if (value.length > 512) {
      throw new BotException('errors.about.invalid');
    }

    return value;
  }
}
