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

type MessageContext = Context & CustomSceneContext & CustomSessionContext;

type WizardMessageContext = Context & WizardContext;

type WizardContext = TelegrafWizardCtx & {
  session: {
    user?: User;
    lang: Language;
  };
} & {
  wizard: {
    state: {
      name?: string;
      location?: string;
      age?: number;
      games?: number[];
    };
  };
};

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

export { MessageContext, WizardMessageContext, WizardContext, PhotoMessage };
