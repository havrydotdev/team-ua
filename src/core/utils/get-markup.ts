import { Markup } from 'telegraf';
import {
  InlineKeyboardMarkup,
  ReplyKeyboardMarkup,
} from 'telegraf/typings/core/types/typegram';
import { TEXT_CALLBACK } from '../constants';

// TODO: РЕФАКТОР ЗИС ХУЙНЯ (ЩО Я НАПИСАВ СУКА?)

const SELECT_LANG_MARKUP = Markup.keyboard([
  [
    Markup.button.callback('🇺🇦', 'lang_ua'),
    Markup.button.callback('🇬🇧', 'lang_en'),
    Markup.button.callback('🇷🇺', 'lang_ru'),
  ],
]).reply_markup;

SELECT_LANG_MARKUP.resize_keyboard = true;

SELECT_LANG_MARKUP.one_time_keyboard = true;

// init remove keyboard markup

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

const getGamesMarkup = (): ReplyKeyboardMarkup => {
  const markup = [[Markup.button.callback('✅', '✅')]];

  const reply_markup = Markup.keyboard(markup).reply_markup;

  reply_markup.resize_keyboard = true;

  return reply_markup;
};

const getProfileMarkup = (url: string): InlineKeyboardMarkup => {
  const markup = [[Markup.button.url(TEXT_CALLBACK, url)]];

  const reply_markup = Markup.inlineKeyboard(markup).reply_markup;

  return reply_markup;
};

export {
  getGamesMarkup,
  getNameMarkup,
  getProfileMarkup,
  getRemoveKeyboardMarkup,
  getSelectLangMarkup,
};
