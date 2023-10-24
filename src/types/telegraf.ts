/* eslint-disable @typescript-eslint/no-unused-vars */
import { PathImpl2 } from '@nestjs/config';
import { User } from 'src/core/entities';
import { Language } from 'src/core/enums';
import { Extra } from 'src/core/types';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { Context } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';
import {
  SceneContext,
  SceneContextScene,
  WizardContext as TelegrafWizardCtx,
} from 'telegraf/typings/scenes';

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

type MsgWithExtra = [MsgKey, Extra];

export {
  MessageContext,
  MsgKey,
  MsgWithExtra,
  PhotoMessage,
  WizardContext,
  WizardMessageContext,
};
