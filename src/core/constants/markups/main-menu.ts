import { Markup } from 'telegraf';
import {
  COOP_CALLBACK,
  HELP_CALLBACK,
  LANG_CALLBACK,
  LOOK_CALLBACK,
  PROFILE_CALLBACK,
} from '../callbacks';

// init main menu markup
const MAIN_MENU_MARKUP = Markup.keyboard([
  [
    Markup.button.callback(PROFILE_CALLBACK, PROFILE_CALLBACK),
    Markup.button.callback(LANG_CALLBACK, LANG_CALLBACK),
    Markup.button.callback(LOOK_CALLBACK, LOOK_CALLBACK),
    Markup.button.callback(COOP_CALLBACK, COOP_CALLBACK),
    Markup.button.callback(HELP_CALLBACK, HELP_CALLBACK),
  ],
]).resize(true).reply_markup;

export { MAIN_MENU_MARKUP };
