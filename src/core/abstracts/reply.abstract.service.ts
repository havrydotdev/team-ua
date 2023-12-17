import {
  SendPhotoArgs,
  SendPhotoReturnType,
  SendTextArgs,
  SendTextReturnType,
} from 'src/types';

abstract class IReplyService {
  abstract sendMessage(...args: SendTextArgs): SendTextReturnType;

  abstract sendPhoto(...args: SendPhotoArgs): SendPhotoReturnType;
}

export { IReplyService };
