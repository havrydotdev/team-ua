import { createMock } from '@golevelup/ts-jest';
import { MessageContext, PhotoMessage } from 'src/types';
import { PhotoSize } from 'telegraf/typings/core/types/typegram';

import { fetchImage } from '../fetch-image';
import { fileFromMsg } from '../file-from-msg';

jest.mock('../fetch-image', () => ({
  fetchImage: jest.fn(),
}));

describe('fileFromMsg', () => {
  it('should fetch the image and return a file object', async () => {
    const ctx: MessageContext = createMock<MessageContext>({
      telegram: {
        getFileLink: jest.fn().mockResolvedValue('http://example.com/test.jpg'),
      },
    });
    const msg: PhotoMessage = createMock<PhotoMessage>({
      photo: [
        createMock<PhotoSize>({ file_id: 'test1' }),
        createMock<PhotoSize>({ file_id: 'test2' }),
      ],
    });
    const buffer = Buffer.from('test');
    (fetchImage as jest.Mock).mockResolvedValue(buffer);

    const result = await fileFromMsg(ctx, msg);

    expect(ctx.telegram.getFileLink).toHaveBeenCalledWith('test2');
    expect(fetchImage).toHaveBeenCalledWith('http://example.com/test.jpg');
    expect(result).toEqual({
      content: buffer,
      name: 'test2',
    });
  });
});
