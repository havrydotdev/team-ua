import { Markup } from 'telegraf';
import { LEAVE_PROFILES_CALLBACK, NEXT_PROFILE_CALLBACK } from '../callbacks';

const PROFILES_MARKUP = Markup.keyboard([
  [
    Markup.button.callback(NEXT_PROFILE_CALLBACK, NEXT_PROFILE_CALLBACK),
    Markup.button.callback(LEAVE_PROFILES_CALLBACK, LEAVE_PROFILES_CALLBACK),
  ],
]).resize(true).reply_markup;

export { PROFILES_MARKUP };
