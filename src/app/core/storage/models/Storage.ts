export interface IStorageService<T> {
  get(key: string): T;
  set(key: string, value: T): void;
  remove(key: string): void;
}
