import { inject, Injectable } from '@angular/core';
import { IHttpService } from '@app/core/http/models/Http';
import { Observable } from 'rxjs';
import { StorageService } from '../storage/storage';

@Injectable({
  providedIn: 'root',
})
export class HttpService<T> implements IHttpService<T> {
  protected storageService = inject(StorageService);

  get(url: string): Observable<T> {
    return new Observable((observer) => {
      const response = this.storageService.get(url);

      if (!response) {
        observer.error(`Resource ${url} not found`);
      }

      observer.next(response);
      observer.complete();
    });
  }

  post(url: string, data: T): Observable<void> {
    return new Observable((observer) => {
      this.storageService.set(url, data);

      observer.next();
      observer.complete();
    });
  }

  put(url: string, data: T): Observable<T> {
    return new Observable((observer) => {
      this.storageService.set(url, data);

      observer.next(data);
      observer.complete();
    });
  }

  delete(url: string): Observable<void> {
    return new Observable((observer) => {
      this.storageService.remove(url);

      observer.next();
      observer.complete();
    });
  }

  patch(url: string, data: T): Observable<T> {
    return new Observable((observer) => {
      const response = this.storageService.get(url);

      if (!response) {
        observer.error(`Resource ${url} not found`);
      }

      this.storageService.set(url, { ...response, ...data });

      observer.next({ ...response, ...data });
      observer.complete();
    });
  }
}
