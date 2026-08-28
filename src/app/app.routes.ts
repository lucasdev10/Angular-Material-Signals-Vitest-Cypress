import { loadRemoteModule } from '@angular-architects/module-federation';
import { Routes } from '@angular/router';
import { environment } from '../environments/environment';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

/**
 * Load remote module from MFE with environment-specific URL
 * @param remoteName - Name of the remote (e.g., 'products', 'cart')
 * @param exposedModule - Exported module path (e.g., './Routes')
 * @returns Promise resolving to the remote module routes
 */
function loadRemoteMFE(remoteName: keyof typeof environment.remotes, exposedModule: string) {
  return () =>
    loadRemoteModule({
      type: 'module',
      remoteEntry: environment.remotes[remoteName],
      exposedModule,
    }).then((m: unknown) => {
      // Handle different module export formats
      if (
        m &&
        typeof m === 'object' &&
        'default' in m &&
        Array.isArray((m as Record<string, unknown>).default)
      ) {
        return (m as Record<string, unknown>).default as Routes;
      }
      if (Array.isArray(m)) {
        return m as Routes;
      }
      // Fallback for Routes array directly
      return m as Routes;
    });
}

export const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  {
    path: 'products',
    loadChildren: loadRemoteMFE('products', './Routes'),
  },
  {
    path: 'cart',
    loadChildren: loadRemoteMFE('cart', './Routes'),
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
    loadChildren: loadRemoteMFE('admin', './Routes'),
  },
  {
    path: 'auth',
    loadChildren: loadRemoteMFE('auth', './Routes'),
  },
  {
    path: 'user',
    canActivate: [authGuard],
    loadChildren: loadRemoteMFE('user', './Routes'),
  },
  { path: '**', redirectTo: '/products' },
];
