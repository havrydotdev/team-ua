import { Markup } from 'telegraf';

const GAMES_MARKUP = Markup.keyboard([
  [Markup.button.callback('✅', '✅')],
]).resize(true).reply_markup;

export { GAMES_MARKUP };
