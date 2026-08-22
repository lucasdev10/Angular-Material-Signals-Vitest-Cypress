/**
 * Barrel exports para facilitar importações
 * Uso: import { SafeHtmlPipe, TimeAgoPipe } from '@app/shared';
 */

// Components
export * from './components/confirm-dialog';
export * from './components/form-error/form-error';
export * from './components/input/input';

// Pipes
export * from './pipes/filter.pipe';
export * from './pipes/highlight.pipe';
export * from './pipes/safe-html.pipe';
export * from './pipes/time-ago.pipe';
export * from './pipes/truncate.pipe';

// Directives
export * from './directives/auto-focus.directive';
export * from './directives/click-outside.directive';
export * from './directives/debounce-click.directive';
export * from './directives/lazy-load.directive';

// Validators
export * from './validators/custom-validators';

// Models
export * from './models/api-response.model';
export * from './models/loading-state';

// Enums
export * from './enums/order-status.enum';
export * from './enums/payment-method.enum';

// Utils
export * from './utils/array.utils';
export * from './utils/date.utils';
export * from './utils/string.utils';

// Decorators
export * from './decorators/track-performance.decorator';
