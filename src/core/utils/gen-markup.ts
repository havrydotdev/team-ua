import { Markup } from 'telegraf';
import { ReplyKeyboardMarkup } from 'telegraf/typings/core/types/typegram';
import { Game } from '../entities';

const SELECT_LANG_MARKUP = Markup.keyboard([
  [
    Markup.button.callback('🇺🇦', 'lang_ua'),
    Markup.button.callback('🇬🇧', 'lang_en'),
    Markup.button.callback('🇷🇺', 'lang_ru'),
  ],
]).reply_markup;

SELECT_LANG_MARKUP.resize_keyboard = true;

SELECT_LANG_MARKUP.one_time_keyboard = true;

const REMOVE_KEYBOARD_MARKUP = Markup.removeKeyboard().reply_markup;

const getRemoveKeyboardMarkup = () => REMOVE_KEYBOARD_MARKUP;

const getSelectLangMarkup = () => SELECT_LANG_MARKUP;

const getNameMarkup = (name: string): ReplyKeyboardMarkup => {
  const reply_markup = Markup.keyboard([
    [Markup.button.callback(name, name)],
  ]).reply_markup;

  // resize keyboard to fit screen
  reply_markup.resize_keyboard = true;

  // hide keyboard after user enters name
  reply_markup.one_time_keyboard = true;

  return reply_markup;
};

const getGamesMarkup = (games: Game[]): ReplyKeyboardMarkup => {
  const reply_markup = Markup.keyboard(
    games.map((game) => Markup.button.callback(game.title, game.title)),
  ).reply_markup;

  reply_markup.resize_keyboard = true;

  return reply_markup;
};

export {
  getGamesMarkup,
  getNameMarkup,
  getRemoveKeyboardMarkup,
  getSelectLangMarkup,
};
