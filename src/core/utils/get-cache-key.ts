const getProfileCacheKey = (userId: number | string) => {
  return `profile:${userId}`;
};

const getImageCacheKey = (userId: number) => {
  return `image:${userId}`;
};

export { getImageCacheKey, getProfileCacheKey };
