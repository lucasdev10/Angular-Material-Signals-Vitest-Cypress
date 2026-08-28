import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

/**
 * Fallback component displayed when an MFE fails to load
 * Shows a friendly error message with retry and navigation options
 */
@Component({
  selector: 'app-mfe-fallback',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <div class="mfe-fallback-container">
      <mat-card class="fallback-card">
        <mat-card-header>
          <mat-icon class="error-icon">error_outline</mat-icon>
          <h2>Unable to Load Module</h2>
        </mat-card-header>

        <mat-card-content>
          <p class="error-message">
            We're having trouble loading the <strong>{{ mfeName || 'requested' }}</strong> module.
          </p>

          <div class="error-details">
            <p class="details-text">This might be due to:</p>
            <ul>
              <li>Temporary network connectivity issues</li>
              <li>The service is temporarily unavailable</li>
              <li>Your browser cache needs clearing</li>
            </ul>
          </div>

          <p class="recovery-text">Try refreshing the page or returning to the home page.</p>
        </mat-card-content>

        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="retry()">
            <mat-icon>refresh</mat-icon>
            Retry
          </button>
          <button mat-stroked-button (click)="goHome()">
            <mat-icon>home</mat-icon>
            Go to Home
          </button>
          <button mat-icon-button (click)="dismiss()">
            <mat-icon>close</mat-icon>
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .mfe-fallback-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 400px;
        padding: 20px;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      }

      .fallback-card {
        max-width: 500px;
        width: 100%;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
      }

      mat-card-header {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 16px;

        .error-icon {
          font-size: 40px;
          width: 40px;
          height: 40px;
          color: #ff6b6b;
        }

        h2 {
          margin: 0;
          font-size: 24px;
          font-weight: 500;
          color: #333;
        }
      }

      mat-card-content {
        padding-top: 0;

        .error-message {
          font-size: 16px;
          color: #555;
          margin-bottom: 16px;
          line-height: 1.5;

          strong {
            color: #333;
            font-weight: 600;
          }
        }

        .error-details {
          background: #fff5f5;
          border-left: 4px solid #ff6b6b;
          padding: 12px 16px;
          margin: 16px 0;
          border-radius: 4px;

          .details-text {
            margin: 0 0 8px 0;
            font-weight: 500;
            color: #333;
            font-size: 14px;
          }

          ul {
            margin: 8px 0 0 0;
            padding-left: 20px;

            li {
              color: #666;
              font-size: 14px;
              margin-bottom: 4px;
            }
          }
        }

        .recovery-text {
          font-size: 14px;
          color: #777;
          margin-top: 16px;
        }
      }

      mat-card-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
        padding-top: 16px;

        button {
          display: flex;
          align-items: center;
          gap: 8px;

          mat-icon {
            font-size: 18px;
            width: 18px;
            height: 18px;
          }
        }

        button[mat-raised-button] {
          flex: 1;
        }

        button[mat-icon-button] {
          margin-left: auto;
        }
      }

      @media (max-width: 600px) {
        .mfe-fallback-container {
          padding: 16px;
        }

        mat-card-header {
          flex-direction: column;
          align-items: flex-start;

          .error-icon {
            align-self: center;
          }
        }

        mat-card-actions {
          flex-wrap: wrap;

          button[mat-raised-button] {
            width: 100%;
          }
        }
      }
    `,
  ],
})
export class MFEFallbackComponent implements OnInit {
  @Input() mfeName?: string;

  private router = inject(Router);
  private isShowing = true;

  ngOnInit(): void {
    // Log for debugging
    console.warn(`MFE Fallback displayed for: ${this.mfeName || 'unknown module'}`);
  }

  /**
   * Reload the page to retry loading the MFE
   */
  retry(): void {
    window.location.reload();
  }

  /**
   * Navigate to home page
   */
  goHome(): void {
    this.router.navigate(['/']);
  }

  /**
   * Dismiss the fallback component
   */
  dismiss(): void {
    if (!this.isShowing) {
      return;
    }

    this.isShowing = false;
    this.goHome();
  }
}
