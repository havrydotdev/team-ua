import { Markup } from 'telegraf';

const START_REPLY_MARKUP = Markup.keyboard([
  [
    Markup.button.callback('🇺🇦', 'lang_ua'),
    Markup.button.callback('🇬🇧', 'lang_en'),
    Markup.button.callback('🇷🇺', 'lang_ru'),
  ],
]).reply_markup;

START_REPLY_MARKUP.resize_keyboard = true;

const CLEAR_REPLY_MARKUP = Markup.removeKeyboard().reply_markup;

export { START_REPLY_MARKUP, CLEAR_REPLY_MARKUP };
