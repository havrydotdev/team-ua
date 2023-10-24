import { HttpException } from '@nestjs/common';
import { MsgKey } from 'src/types';

class BotException extends HttpException {
  constructor(message?: MsgKey) {
    super(message, 400);
  }
}

export { BotException };
