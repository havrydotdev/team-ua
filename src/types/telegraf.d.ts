/* eslint-disable @typescript-eslint/no-unused-vars */
import { WizardContext } from 'telegraf/typings/scenes';
import { Context } from 'telegraf';
import { Language } from 'src/core/enums';

type MessageContext = Context & CustomSceneContext & CustomSessionContext;

type WizardMessageContext = Context & WizardContext;

type WizardContext = WizardContext & {
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
