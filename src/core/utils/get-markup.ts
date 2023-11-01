import { Markup } from 'telegraf';
import {
  InlineKeyboardMarkup,
  ReplyKeyboardMarkup,
} from 'telegraf/typings/core/types/typegram';
import { TEXT_CALLBACK } from '../constants';

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

const getProfileMarkup = (url: string): InlineKeyboardMarkup => {
  const markup = [[Markup.button.url(TEXT_CALLBACK, url)]];

  const reply_markup = Markup.inlineKeyboard(markup).reply_markup;

  return reply_markup;
};

export { getNameMarkup, getProfileMarkup };
