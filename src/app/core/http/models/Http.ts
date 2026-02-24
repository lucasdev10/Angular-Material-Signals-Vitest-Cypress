import { Observable } from 'rxjs';

export interface IHttpService<T> {
  get(url: string): Observable<T>;
  post(url: string, data: T): Observable<void>;
  put(url: string, data: T): Observable<T>;
  delete(url: string): Observable<void>;
  patch(url: string, data: T): Observable<T>;
}
