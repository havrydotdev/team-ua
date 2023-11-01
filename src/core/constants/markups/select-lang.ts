import { Markup } from 'telegraf';

const SELECT_LANG_MARKUP = Markup.keyboard([
  [
    Markup.button.callback('🇺🇦', 'lang_ua'),
    Markup.button.callback('🇬🇧', 'lang_en'),
    Markup.button.callback('🇷🇺', 'lang_ru'),
  ],
])
  .resize(true)
  .oneTime(true).reply_markup;

export { SELECT_LANG_MARKUP };
