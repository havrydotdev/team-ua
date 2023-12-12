import { MsgKey, MsgWithExtra } from 'src/types';

// ???
const isI18nKey = (obj: any): obj is MsgKey => {
  return typeof obj === 'string';
};

const isMsgWithExtra = (obj: any): obj is MsgWithExtra => {
  return (
    obj instanceof Array &&
    obj.length === 2 &&
    isI18nKey(obj[0]) &&
    typeof obj[1] === 'object'
  );
};

// should i check all items??
const isMsgWithExtraArr = (obj: any): obj is MsgWithExtra[] => {
  return obj instanceof Array && isMsgWithExtra(obj[0]);
};

export { isI18nKey, isMsgWithExtra, isMsgWithExtraArr };
