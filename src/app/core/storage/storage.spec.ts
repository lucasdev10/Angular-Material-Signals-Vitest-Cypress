import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage';

describe('Storage', () => {
  let service: StorageService<unknown>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
