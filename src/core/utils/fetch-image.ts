import fetch from 'node-fetch';

const fetchImage = async (fileUrl: URL): Promise<Buffer> => {
  const file = await (await fetch(fileUrl)).arrayBuffer();

  return Buffer.from(file);
};

export { fetchImage };
