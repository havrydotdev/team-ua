import { MessageContext, PhotoMessage } from 'src/types';
import { fetchImage } from './fetch-image';

type File = {
  content: Buffer;
  name: string;
};

const fileFromMsg = async (
  ctx: MessageContext,
  msg: PhotoMessage,
): Promise<File> => {
  const tgFileId = msg.photo.pop().file_id;

  const fileUrl = await ctx.telegram.getFileLink(tgFileId);

  return {
    content: await fetchImage(fileUrl),
    name: tgFileId,
  };
};

export { fileFromMsg };
