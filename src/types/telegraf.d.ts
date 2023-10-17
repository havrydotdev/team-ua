/* eslint-disable @typescript-eslint/no-unused-vars */
import { WizardContext } from 'telegraf/typings/scenes';
import { Context } from 'telegraf';
import { Language } from 'src/core/enums';

declare module 'telegraf/typings' {
  interface Context extends CustomSessionContext, CustomSceneContext {}
}

declare module 'telegraf/typings/scenes' {
  interface WizardContext extends CustomSessionContext {}
}

interface CustomSessionContext {
  session: {
    user?: User;
    lang: Language;
  };
}

interface CustomSceneContext {
  scene: SceneContextScene<SceneContext>;
}
