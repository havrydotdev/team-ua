/* eslint-disable @typescript-eslint/no-unused-vars */
import { PathImpl2 } from '@nestjs/config';
import { Profile, User } from 'src/core/entities';
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
      about?: string;
      age?: number;
      games?: number[];
    };
  };
};

type ProfilesWizardState = {
  wizard: {
    state: {
      current?: Profile;
    };
  };
};

type WizardMessageContext = Context & WizardContext;

type ProfilesMessageContext = Context & ProfilesContext;

type WizardContext = TelegrafWizardCtx & {
  session: {
    user?: User;
    lang: Language;
  };
} & WizardState;

type ProfilesContext = TelegrafWizardCtx & {
  session: {
    user?: User;
    lang: Language;
  };
} & ProfilesWizardState;

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
  ProfilesContext,
  ProfilesMessageContext,
  WizardContext,
  WizardMessageContext,
};
