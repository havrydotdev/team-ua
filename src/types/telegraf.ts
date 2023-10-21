/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  SceneContext,
  SceneContextScene,
  WizardContext as TelegrafWizardCtx,
} from 'telegraf/typings/scenes';
import { Context } from 'telegraf';
import { Language } from 'src/core/enums';
import { User } from 'src/core';
import { Message } from 'telegraf/typings/core/types/typegram';
import { PathImpl2 } from '@nestjs/config';
import { I18nTranslations } from 'src/generated/i18n.generated';

type MessageContext = Context & CustomSceneContext & CustomSessionContext;

type WizardState = {
  wizard: {
    state: {
      name?: string;
      location?: string;
      age?: number;
      games?: number[];
    };
  };
};

type WizardMessageContext = Context & WizardContext & WizardState;

type WizardContext = TelegrafWizardCtx & {
  session: {
    user?: User;
    lang: Language;
  };
} & WizardState;

type CustomSessionContext = {
  session: {
    user?: User;
    lang: Language;
  };
};

type CustomSceneContext = {
  scene: SceneContextScene<SceneContext>;
};

type PhotoMessage = Message.PhotoMessage;

type MsgKey = PathImpl2<I18nTranslations>;

export {
  MessageContext,
  WizardMessageContext,
  WizardContext,
  PhotoMessage,
  MsgKey,
};
