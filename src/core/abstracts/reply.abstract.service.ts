import { Telegram } from 'telegraf';
import { Context } from '../interfaces';
import ApiClient from 'telegraf/typings/core/network/client';

type Tail<T> = T extends [unknown, ...infer U] ? U : never;

type Shorthand<FName extends Exclude<keyof Telegram, keyof ApiClient>> = Tail<
  Parameters<Telegram[FName]>
>;

abstract class IReplyService {
  abstract sendMessage(
    ctx: Context,
    ...args: Shorthand<'sendMessage'>
  ): Promise<void>;
}

export { IReplyService };
