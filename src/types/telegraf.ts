import { PathImpl2 } from '@nestjs/config';
import { Profile } from 'src/core/entities';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { Context } from 'telegraf';
import {
  ForceReply,
  InlineKeyboardMarkup,
  Message,
  MessageEntity,
  ParseMode,
  ReplyKeyboardMarkup,
  ReplyKeyboardRemove,
} from 'telegraf/typings/core/types/typegram';
import { FmtString } from 'telegraf/typings/format';
import {
  SceneContext,
  SceneContextScene,
  WizardContext as TelegrafWizardContext,
} from 'telegraf/typings/scenes';

enum Language {
  EN = 'en',
  UA = 'ua',
}

type I18nArgs =
  | (
      | {
          [k: string]: any;
        }
      | string
    )[]
  | {
      [k: string]: any;
    };

type Extra = Omit<
  {
    allow_sending_without_reply?: boolean;
    chat_id: number | string;
    disable_notification?: boolean;
    disable_web_page_preview?: boolean;
    entities?: MessageEntity[];
    i18nArgs?: I18nArgs;
    message_thread_id?: number;
    parse_mode?: ParseMode;
    protect_content?: boolean;
    reply_markup?:
      | ForceReply
      | InlineKeyboardMarkup
      | ReplyKeyboardMarkup
      | ReplyKeyboardRemove;
    reply_to_message_id?: number;
    text: string;
  },
  'chat_id' | 'text'
>;

type PhotoExtra = Extra & {
  caption?: FmtString | string;
  caption_entities?: MessageEntity[];
};

type CustomSceneContext = {
  scene: SceneContextScene<SceneContext>;
};

type RegisterWizardState = {
  wizard: {
    state: {
      about?: string;
      age?: number;
      games?: number[];
      name?: string;
    };
  };
};

type SendMessageWizardState = {
  wizard: {
    state: {
      message?: {
        en?: string;
        ua?: string;
      };
      photo?: string;
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

type SessionData = {
  seenLength?: number;
  seenProfiles?: number[];
};

type CustomSessionContext = {
  session: SessionData;
};

type WizardContext = MessageContext & TelegrafWizardContext;

type MessageContext = Context & CustomSceneContext & CustomSessionContext;

type ProfilesWizardContext = WizardContext & ProfilesWizardState;

type RegisterWizardContext = WizardContext & RegisterWizardState;

type SendMessageWizardContext = WizardContext & SendMessageWizardState;

type PhotoMessage = Message.PhotoMessage;

type MsgKey = PathImpl2<I18nTranslations>;

type MsgWithExtra = [MsgKey, Extra];

type HandlerResponse = MsgKey | MsgWithExtra | MsgWithExtra[] | void;

// eslint-disable-next-line @typescript-eslint/ban-types
type Constructor<T> = Function & { prototype: T };

export {
  Constructor,
  Extra,
  HandlerResponse,
  I18nArgs,
  Language,
  MessageContext,
  MsgKey,
  MsgWithExtra,
  PhotoExtra,
  PhotoMessage,
  ProfilesWizardContext,
  RegisterWizardContext,
  SendMessageWizardContext,
  SessionData,
  WizardContext,
};
