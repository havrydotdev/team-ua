const getProfileCacheKey = (userId: number) => {
  return `profile:${userId}`;
};

const getImageCacheKey = (userId: number) => {
  return `image:${userId}`;
};

export { getImageCacheKey, getProfileCacheKey };
