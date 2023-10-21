function partial<T>(): new () => T {
  return class {} as any;
}

export { partial };
