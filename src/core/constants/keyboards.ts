import { Markup } from 'telegraf';

import {
  CANCEL_CALLBACK,
  CLEAR_LAST_NO_CALLBACK,
  CLEAR_LAST_YES_CALLBACK,
  CONFIRM_CALLBACK,
  COOP_CALLBACK,
  DONT_CHANGE_CALLBACK,
  HELP_CALLBACK,
  LANG_CALLBACK,
  LEAVE_PROFILES_CALLBACK,
  LOOK_CALLBACK,
  NEXT_PROFILE_CALLBACK,
  PROFILE_CALLBACK,
  REPORT_CALLBACK,
  SKIP_STEP_CALLBACK,
} from './callbacks';

export class Keyboards {
  static clearLast = Markup.keyboard([
    [
      Markup.button.callback(CLEAR_LAST_YES_CALLBACK, CLEAR_LAST_YES_CALLBACK),
      Markup.button.callback(CLEAR_LAST_NO_CALLBACK, CLEAR_LAST_NO_CALLBACK),
    ],
  ]).resize(true).reply_markup;

  static games = Markup.keyboard([
    [Markup.button.callback(CONFIRM_CALLBACK, CONFIRM_CALLBACK)],
  ]).resize(true).reply_markup;

  static gamesWithSkip = Markup.keyboard([
    [Markup.button.callback(CONFIRM_CALLBACK, CONFIRM_CALLBACK)],
    [Markup.button.callback(DONT_CHANGE_CALLBACK, DONT_CHANGE_CALLBACK)],
  ]).resize(true).reply_markup;

  static mainMenu = Markup.keyboard([
    [
      Markup.button.callback(PROFILE_CALLBACK, PROFILE_CALLBACK),
      Markup.button.callback(LANG_CALLBACK, LANG_CALLBACK),
      Markup.button.callback(LOOK_CALLBACK, LOOK_CALLBACK),
      Markup.button.callback(COOP_CALLBACK, COOP_CALLBACK),
      Markup.button.callback(HELP_CALLBACK, HELP_CALLBACK),
    ],
  ]).resize(true).reply_markup;

  static profiles = Markup.keyboard([
    [
      Markup.button.callback(NEXT_PROFILE_CALLBACK, NEXT_PROFILE_CALLBACK),
      Markup.button.callback(LEAVE_PROFILES_CALLBACK, LEAVE_PROFILES_CALLBACK),
      Markup.button.callback(REPORT_CALLBACK, REPORT_CALLBACK),
    ],
  ]).resize(true).reply_markup;

  static refill = Markup.keyboard([
    [
      Markup.button.callback(CONFIRM_CALLBACK, CONFIRM_CALLBACK),
      Markup.button.callback(CANCEL_CALLBACK, CANCEL_CALLBACK),
    ],
  ])
    .resize(true)
    .oneTime(true).reply_markup;

  static remove = Markup.removeKeyboard().reply_markup;

  static selectLang = Markup.keyboard([
    [
      Markup.button.callback('🇺🇦', 'lang_ua'),
      Markup.button.callback('🇬🇧', 'lang_en'),
    ],
  ])
    .resize(true)
    .oneTime(true).reply_markup;

  static skipStep = Markup.keyboard([
    Markup.button.callback(SKIP_STEP_CALLBACK, SKIP_STEP_CALLBACK),
  ])
    .oneTime()
    .resize().reply_markup;
}
