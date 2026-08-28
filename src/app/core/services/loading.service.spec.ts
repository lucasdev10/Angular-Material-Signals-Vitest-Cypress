import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingService],
    });
    service = TestBed.inject(LoadingService);
  });

  afterEach(() => {
    service.reset();
  });

  it('should be created as a singleton', () => {
    const service2 = TestBed.inject(LoadingService);
    expect(service).toBe(service2);
  });

  it('should initialize with isLoading as false', () => {
    service.reset();
    expect(service.isLoading()).toBe(false);
  });

  it('should set isLoading to true when show is called', () => {
    service.show();
    expect(service.isLoading()).toBe(true);
  });

  it('should decrement loading count when hide is called', () => {
    service.show();
    service.show();
    service.hide();

    expect(service.isLoading()).toBe(true);
  });

  it('should set isLoading to false when hide is called and count reaches 0', () => {
    service.show();
    service.hide();

    expect(service.isLoading()).toBe(false);
  });

  it('should handle multiple show/hide calls correctly', () => {
    service.show();
    service.show();
    service.show();

    expect(service.isLoading()).toBe(true);

    service.hide();
    expect(service.isLoading()).toBe(true);

    service.hide();
    expect(service.isLoading()).toBe(true);

    service.hide();
    expect(service.isLoading()).toBe(false);
  });

  it('should not go below 0 when hide is called without show', () => {
    service.hide();
    service.hide();

    expect(service.isLoading()).toBe(false);
  });

  it('should reset loading state', () => {
    service.show();
    service.show();
    service.show();

    expect(service.isLoading()).toBe(true);

    service.reset();

    expect(service.isLoading()).toBe(false);
  });

  it('should reset loading count to 0', () => {
    service.show();
    service.show();
    service.reset();

    service.show();
    service.hide();

    expect(service.isLoading()).toBe(false);
  });
});
