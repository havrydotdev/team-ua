import { createMock } from '@golevelup/ts-jest';
import fetch from 'node-fetch';
import { fetchImage } from '../fetch-image';

jest.mock('node-fetch', () => {
  const originalModule = jest.requireActual('node-fetch');

  return {
    ...originalModule,
    default: jest.fn(),
  };
});

describe('fetchImage', () => {
  it('should return a buffer', async () => {
    const mockData = new ArrayBuffer(123);
    (fetch as unknown as jest.Mock).mockResolvedValueOnce(
      createMock<Response>({
        arrayBuffer: jest.fn().mockResolvedValueOnce(mockData),
      }),
    );

    const result = await fetchImage(new URL('https://test.com'));

    expect(fetch).toHaveBeenCalledWith(new URL('https://test.com'));
    expect(result).toEqual(Buffer.from(mockData));
  });
});
