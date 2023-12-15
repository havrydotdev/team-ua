import { Markup } from 'telegraf';
import {
  InlineKeyboardMarkup,
  ReplyKeyboardMarkup,
} from 'telegraf/typings/core/types/typegram';

import {
  AD_CALLBACK,
  DELETE_PROFILE_CALLBACK,
  LEAVE_PROFILES_CALLBACK,
  NEXT_PROFILE_CALLBACK,
  REPORT_CALLBACK,
  TEXT_CALLBACK,
  UPDATE_PROFILE_CALLBACK,
} from '../constants';

const getDontChangeMarkup = (name: string): ReplyKeyboardMarkup => {
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

const getProfilesWizardMarkup = (
  userRole: 'admin' | 'user',
): ReplyKeyboardMarkup => {
  const buttons = [
    Markup.button.callback(NEXT_PROFILE_CALLBACK, NEXT_PROFILE_CALLBACK),
    Markup.button.callback(LEAVE_PROFILES_CALLBACK, LEAVE_PROFILES_CALLBACK),
    Markup.button.callback(REPORT_CALLBACK, REPORT_CALLBACK),
  ];

  if (userRole === 'admin') {
    buttons.push(
      Markup.button.callback(DELETE_PROFILE_CALLBACK, DELETE_PROFILE_CALLBACK),
    );
  }

  return Markup.keyboard([buttons]).resize(true).reply_markup;
};

export {
  getAdMarkup,
  getDontChangeMarkup,
  getMeMarkup,
  getProfileMarkup,
  getProfilesWizardMarkup,
  getReportMarkup,
};
