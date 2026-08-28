import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MFEFallbackComponent } from './mfe-fallback.component';

describe('MFEFallbackComponent', () => {
  let component: MFEFallbackComponent;
  let fixture: ComponentFixture<MFEFallbackComponent>;
  let router: {
    navigate: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    router = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [MFEFallbackComponent],
      providers: [{ provide: Router, useValue: router }],
    }).compileComponents();

    fixture = TestBed.createComponent(MFEFallbackComponent);
    component = fixture.componentInstance;
  });

  describe('component initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display provided MFE name', () => {
      component.mfeName = 'Products';
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Products');
    });

    it('should display default text if MFE name not provided', () => {
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('requested');
    });

    it('should display fallback card with error icon', () => {
      fixture.detectChanges();

      const card = fixture.nativeElement.querySelector('mat-card');
      expect(card).toBeTruthy();

      const errorIcon = fixture.nativeElement.querySelector('.error-icon');
      expect(errorIcon).toBeTruthy();
      expect(errorIcon.textContent).toContain('error_outline');
    });
  });

  describe('UI elements', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should display header with unable to load message', () => {
      const header = fixture.nativeElement.querySelector('mat-card-header h2');
      expect(header.textContent).toContain('Unable to Load Module');
    });

    it('should display error message', () => {
      const errorMessage = fixture.nativeElement.querySelector('.error-message');
      expect(errorMessage).toBeTruthy();
      expect(errorMessage.textContent).toContain('trouble loading');
    });

    it('should display error details list', () => {
      const detailsList = fixture.nativeElement.querySelectorAll('.error-details ul li');
      expect(detailsList.length).toBeGreaterThan(0);
      expect(detailsList[0].textContent).toContain('network connectivity');
    });

    it('should display recovery instructions', () => {
      const recoveryText = fixture.nativeElement.querySelector('.recovery-text');
      expect(recoveryText).toBeTruthy();
      expect(recoveryText.textContent).toContain('refresh');
    });
  });

  describe('action buttons', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should have retry button', () => {
      const retryButton = fixture.nativeElement.querySelector('button[mat-raised-button]');
      expect(retryButton).toBeTruthy();
      expect(retryButton.textContent).toContain('Retry');
    });

    it('should have go home button', () => {
      const buttons = fixture.nativeElement.querySelectorAll('button[mat-stroked-button]');
      expect(buttons.length).toBeGreaterThan(0);
      expect(buttons[0].textContent).toContain('Home');
    });

    it('should have close button', () => {
      const closeButton = fixture.nativeElement.querySelector('button[mat-icon-button]');
      expect(closeButton).toBeTruthy();
      expect(closeButton.textContent).toContain('close');
    });
  });

  describe('retry method', () => {
    it('should call retry function', () => {
      const retrySpy = vi.spyOn(component, 'retry');

      component.retry();

      expect(retrySpy).toHaveBeenCalled();
      retrySpy.mockRestore();
    });

    it('should trigger retry method on retry button click', () => {
      const retrySpy = vi.spyOn(component, 'retry');
      fixture.detectChanges();

      const retryButton = fixture.nativeElement.querySelector('button[mat-raised-button]');
      retryButton.click();

      expect(retrySpy).toHaveBeenCalled();
      retrySpy.mockRestore();
    });
  });

  describe('goHome method', () => {
    it('should navigate to home route', () => {
      component.goHome();

      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should navigate to home on go home button click', () => {
      fixture.detectChanges();

      const homeButton = fixture.nativeElement.querySelector('button[mat-stroked-button]');
      homeButton.click();

      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('dismiss method', () => {
    it('should dismiss fallback and navigate home', () => {
      const goHomeSpy = vi.spyOn(component, 'goHome');
      fixture.detectChanges();

      component.dismiss();

      expect(goHomeSpy).toHaveBeenCalled();
      goHomeSpy.mockRestore();
    });

    it('should only dismiss once', () => {
      const goHomeSpy = vi.spyOn(component, 'goHome');
      fixture.detectChanges();

      component.dismiss();
      expect(goHomeSpy).toHaveBeenCalledTimes(1);

      component.dismiss();
      // Should still be called only once
      expect(goHomeSpy).toHaveBeenCalledTimes(1);
      goHomeSpy.mockRestore();
    });

    it('should navigate on close button click', () => {
      fixture.detectChanges();

      const closeButton = fixture.nativeElement.querySelector('button[mat-icon-button]');
      closeButton.click();

      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('styling', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should apply fallback container styling', () => {
      const container = fixture.nativeElement.querySelector('.mfe-fallback-container');
      expect(container).toBeTruthy();
      expect(container.className).toContain('mfe-fallback-container');
    });

    it('should apply card styling', () => {
      const card = fixture.nativeElement.querySelector('.fallback-card');
      expect(card).toBeTruthy();
      expect(card.className).toContain('fallback-card');
    });

    it('should display error icon with appropriate styling', () => {
      const errorIcon = fixture.nativeElement.querySelector('.error-icon');
      expect(errorIcon.className).toContain('error-icon');
    });
  });

  describe('console logging', () => {
    it('should log warning to console on init', () => {
      const warnSpy = vi.spyOn(console, 'warn');
      component.mfeName = 'TestModule';

      component.ngOnInit();

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('MFE Fallback displayed for: TestModule'),
      );
      warnSpy.mockRestore();
    });

    it('should log unknown module if name not provided', () => {
      const warnSpy = vi.spyOn(console, 'warn');

      component.ngOnInit();

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('unknown module'));
      warnSpy.mockRestore();
    });
  });

  describe('material components usage', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should use mat-card component', () => {
      const card = fixture.nativeElement.querySelector('mat-card');
      expect(card).toBeTruthy();
    });

    it('should use mat-card-header', () => {
      const header = fixture.nativeElement.querySelector('mat-card-header');
      expect(header).toBeTruthy();
    });

    it('should use mat-card-content', () => {
      const content = fixture.nativeElement.querySelector('mat-card-content');
      expect(content).toBeTruthy();
    });

    it('should use mat-card-actions', () => {
      const actions = fixture.nativeElement.querySelector('mat-card-actions');
      expect(actions).toBeTruthy();
    });

    it('should use mat-icon components', () => {
      const icons = fixture.nativeElement.querySelectorAll('mat-icon');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('should use mat-button directives', () => {
      const buttons = fixture.nativeElement.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });
});
