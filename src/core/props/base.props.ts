export abstract class BaseProps<T = any> {
  constructor(private readonly _data: T) {}

  get data(): T {
    return this._data;
  }
}
