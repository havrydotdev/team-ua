import { Markup } from 'telegraf';
import {
  InlineKeyboardMarkup,
  ReplyKeyboardMarkup,
} from 'telegraf/typings/core/types/typegram';

import {
  AD_CALLBACK,
  TEXT_CALLBACK,
  UPDATE_PROFILE_CALLBACK,
} from '../constants';

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

const getAdMarkup = (url?: string): InlineKeyboardMarkup => {
  const markup = url ? [[Markup.button.url(AD_CALLBACK, url)]] : [];

  const reply_markup = Markup.inlineKeyboard(markup).reply_markup;

  return reply_markup;
};

const getReportMarkup = (
  userId: number,
  reporterId: number,
): InlineKeyboardMarkup => {
  const markup = Markup.inlineKeyboard([
    Markup.button.callback('Delete Profile', `sen-${userId}`),
    Markup.button.callback('Reporter Info', `reporter-info-${reporterId}`),
  ]).reply_markup;

  return markup;
};

const getMeMarkup = (text: string): InlineKeyboardMarkup => {
  const markup = Markup.inlineKeyboard([
    Markup.button.callback(text, UPDATE_PROFILE_CALLBACK),
  ]).reply_markup;

  return markup;
};

export {
  getAdMarkup,
  getMeMarkup,
  getNameMarkup,
  getProfileMarkup,
  getReportMarkup,
};
