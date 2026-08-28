import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LogLevel, LoggerService } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;
  let consoleDebugSpy: ReturnType<typeof vi.spyOn>;
  let consoleInfoSpy: ReturnType<typeof vi.spyOn>;
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoggerService],
    });
    service = TestBed.inject(LoggerService);

    consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    service.setConsoleLogging(true);
    service.setLogLevel(LogLevel.Debug);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created as a singleton', () => {
    const service2 = TestBed.inject(LoggerService);
    expect(service).toBe(service2);
  });

  it('should log debug messages', () => {
    service.debug('Test debug message');

    expect(consoleDebugSpy).toHaveBeenCalled();
    const callArgs = consoleDebugSpy.mock.calls[0];
    expect(callArgs[0]).toContain('[Debug]');
    expect(callArgs[1]).toBe('Test debug message');
  });

  it('should log info messages', () => {
    service.info('Test info message');

    expect(consoleInfoSpy).toHaveBeenCalled();
    const callArgs = consoleInfoSpy.mock.calls[0];
    expect(callArgs[0]).toContain('[Info]');
    expect(callArgs[1]).toBe('Test info message');
  });

  it('should log warning messages', () => {
    service.warning('Test warning message');

    expect(consoleWarnSpy).toHaveBeenCalled();
    const callArgs = consoleWarnSpy.mock.calls[0];
    expect(callArgs[0]).toContain('[Warning]');
    expect(callArgs[1]).toBe('Test warning message');
  });

  it('should log error messages', () => {
    service.error('Test error message');

    expect(consoleErrorSpy).toHaveBeenCalled();
    const callArgs = consoleErrorSpy.mock.calls[0];
    expect(callArgs[0]).toContain('[Error]');
    expect(callArgs[1]).toBe('Test error message');
  });

  it('should respect log level setting', () => {
    service.setLogLevel(LogLevel.Warning);

    service.debug('Debug message');
    service.info('Info message');
    service.warning('Warning message');

    expect(consoleDebugSpy).not.toHaveBeenCalled();
    expect(consoleInfoSpy).not.toHaveBeenCalled();
    expect(consoleWarnSpy).toHaveBeenCalled();
  });

  it('should respect console logging setting', () => {
    service.setConsoleLogging(false);

    service.info('Test message');

    expect(consoleInfoSpy).not.toHaveBeenCalled();
  });

  it('should include timestamp in log output', () => {
    service.info('Test message');

    const callArgs = consoleInfoSpy.mock.calls[0];
    expect(callArgs[0]).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  it('should handle log level Debug', () => {
    service.setLogLevel(LogLevel.Debug);

    service.debug('Debug');
    service.info('Info');
    service.warning('Warning');
    service.error('Error');

    expect(consoleDebugSpy).toHaveBeenCalled();
    expect(consoleInfoSpy).toHaveBeenCalled();
    expect(consoleWarnSpy).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('should handle log level Info', () => {
    service.setLogLevel(LogLevel.Info);

    service.debug('Debug');
    service.info('Info');
    service.warning('Warning');
    service.error('Error');

    expect(consoleDebugSpy).not.toHaveBeenCalled();
    expect(consoleInfoSpy).toHaveBeenCalled();
    expect(consoleWarnSpy).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('should handle log level Error', () => {
    service.setLogLevel(LogLevel.Error);

    service.debug('Debug');
    service.info('Info');
    service.warning('Warning');
    service.error('Error');

    expect(consoleDebugSpy).not.toHaveBeenCalled();
    expect(consoleInfoSpy).not.toHaveBeenCalled();
    expect(consoleWarnSpy).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('should handle additional arguments in log calls', () => {
    const additionalArg = { key: 'value' };
    service.info('Test message', additionalArg);

    expect(consoleInfoSpy).toHaveBeenCalled();
    const callArgs = consoleInfoSpy.mock.calls[0];
    expect(callArgs).toContainEqual(additionalArg);
  });
});
