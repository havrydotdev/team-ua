import { Context as TelegrafContext } from 'telegraf';
import { User } from '../entities';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Context extends TelegrafContext {
  session: {
    user?: User;
    lang: 'ua' | 'en' | 'ru';
  };
}
