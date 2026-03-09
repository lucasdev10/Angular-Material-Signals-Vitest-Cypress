import { TestBed } from '@angular/core/testing';
import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({}).compileComponents();
  });

  it('create an instance', () => {
    const pipe = new TruncatePipe();
    expect(pipe).toBeTruthy();
  });

  it('should truncate string with default length', () => {
    const pipe = new TruncatePipe();
    expect(pipe.transform('1234567890', 7)).toBe('1234567...');
  });
});
