import { TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let snackBarSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationService, MatSnackBar],
    });
    service = TestBed.inject(NotificationService);

    const snackBar = TestBed.inject(MatSnackBar);
    snackBarSpy = vi.spyOn(snackBar, 'open').mockReturnValue({
      onAction: () => ({}),
      afterDismissed: () => ({}),
      afterOpened: () => ({}),
      close: () => {},
      _dismissAfter: () => {},
      _getAnimationState: () => 'visible',
    } as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created as a singleton', () => {
    const service2 = TestBed.inject(NotificationService);
    expect(service).toBe(service2);
  });

  it('should show success message with default action', () => {
    service.success('Success message');

    expect(snackBarSpy).toHaveBeenCalledWith(
      'Success message',
      'Close',
      expect.objectContaining({
        panelClass: ['snackbar-success'],
      }),
    );
  });

  it('should show success message with custom action', () => {
    service.success('Success message', 'Undo');

    expect(snackBarSpy).toHaveBeenCalledWith(
      'Success message',
      'Undo',
      expect.objectContaining({
        panelClass: ['snackbar-success'],
      }),
    );
  });

  it('should show error message with longer duration', () => {
    service.error('Error message');

    expect(snackBarSpy).toHaveBeenCalledWith(
      'Error message',
      'Close',
      expect.objectContaining({
        duration: 5000,
        panelClass: ['snackbar-error'],
      }),
    );
  });

  it('should show error message with custom action', () => {
    service.error('Error message', 'Retry');

    expect(snackBarSpy).toHaveBeenCalledWith(
      'Error message',
      'Retry',
      expect.objectContaining({
        panelClass: ['snackbar-error'],
      }),
    );
  });

  it('should show warning message', () => {
    service.warning('Warning message');

    expect(snackBarSpy).toHaveBeenCalledWith(
      'Warning message',
      'Close',
      expect.objectContaining({
        panelClass: ['snackbar-warning'],
      }),
    );
  });

  it('should show warning message with custom action', () => {
    service.warning('Warning message', 'Dismiss');

    expect(snackBarSpy).toHaveBeenCalledWith(
      'Warning message',
      'Dismiss',
      expect.objectContaining({
        panelClass: ['snackbar-warning'],
      }),
    );
  });

  it('should show info message', () => {
    service.info('Info message');

    expect(snackBarSpy).toHaveBeenCalledWith(
      'Info message',
      'Close',
      expect.objectContaining({
        panelClass: ['snackbar-info'],
      }),
    );
  });

  it('should show info message with custom action', () => {
    service.info('Info message', 'OK');

    expect(snackBarSpy).toHaveBeenCalledWith(
      'Info message',
      'OK',
      expect.objectContaining({
        panelClass: ['snackbar-info'],
      }),
    );
  });

  it('should show custom message with config', () => {
    const customConfig: MatSnackBarConfig = {
      duration: 10000,
      horizontalPosition: 'center',
    };

    service.custom('Custom message', customConfig);

    expect(snackBarSpy).toHaveBeenCalledWith(
      'Custom message',
      'Close',
      expect.objectContaining({
        duration: 10000,
        horizontalPosition: 'center',
      }),
    );
  });

  it('should use default config for success messages', () => {
    service.success('Success');

    const callArgs = snackBarSpy.mock.calls[0][2] as MatSnackBarConfig;
    expect(callArgs.duration).toBe(3000);
    expect(callArgs.horizontalPosition).toBe('end');
    expect(callArgs.verticalPosition).toBe('top');
  });

  it('should merge custom config with defaults in custom method', () => {
    const customConfig: MatSnackBarConfig = {
      panelClass: ['custom-class'],
    };

    service.custom('Message', customConfig);

    const callArgs = snackBarSpy.mock.calls[0][2] as MatSnackBarConfig;
    expect(callArgs.duration).toBe(3000);
    expect(callArgs.panelClass).toContain('custom-class');
  });
});
