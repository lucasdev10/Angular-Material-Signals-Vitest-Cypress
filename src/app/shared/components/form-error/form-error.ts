import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';
import { MatError } from '@angular/material/form-field';

@Component({
  selector: 'app-form-error',
  imports: [MatError],
  templateUrl: './form-error.html',
  styleUrl: './form-error.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class FormError {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input({ required: true }) control: FieldTree<unknown, string | number> | any = null;
}
