import { Injectable } from '@angular/core';
import { IStorageService } from '@app/core/storage/models/Storage';

@Injectable({
  providedIn: 'root',
})
export class StorageService<T> implements IStorageService<T> {
  get(key: string): T {
    return JSON.parse(localStorage.getItem(key) as string);
  }

  set(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }
}
