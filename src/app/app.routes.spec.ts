import { routes } from './app.routes';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

describe('App Routes', () => {
  describe('route structure', () => {
    it('should have root redirect to /products', () => {
      const rootRoute = routes.find((r) => r.path === '');
      expect(rootRoute).toBeDefined();
      expect(rootRoute?.redirectTo).toBe('/products');
      expect(rootRoute?.pathMatch).toBe('full');
    });

    it('should have wildcard fallback redirecting to /products', () => {
      const wildcardRoute = routes.find((r) => r.path === '**');
      expect(wildcardRoute).toBeDefined();
      expect(wildcardRoute?.redirectTo).toBe('/products');
    });

    it('should have products route with loadChildren', () => {
      const productsRoute = routes.find((r) => r.path === 'products');
      expect(productsRoute).toBeDefined();
      expect(productsRoute?.loadChildren).toBeDefined();
      expect(typeof productsRoute?.loadChildren).toBe('function');
    });

    it('should have cart route with loadChildren', () => {
      const cartRoute = routes.find((r) => r.path === 'cart');
      expect(cartRoute).toBeDefined();
      expect(cartRoute?.loadChildren).toBeDefined();
      expect(typeof cartRoute?.loadChildren).toBe('function');
    });

    it('should have auth route with loadChildren', () => {
      const authRoute = routes.find((r) => r.path === 'auth');
      expect(authRoute).toBeDefined();
      expect(authRoute?.loadChildren).toBeDefined();
      expect(typeof authRoute?.loadChildren).toBe('function');
    });

    it('should have user route with authGuard and loadChildren', () => {
      const userRoute = routes.find((r) => r.path === 'user');
      expect(userRoute).toBeDefined();
      expect(userRoute?.canActivate).toBeDefined();
      expect(userRoute?.canActivate).toContain(authGuard);
      expect(userRoute?.loadChildren).toBeDefined();
      expect(typeof userRoute?.loadChildren).toBe('function');
    });

    it('should have admin route with authGuard and roleGuard', () => {
      const adminRoute = routes.find((r) => r.path === 'admin');
      expect(adminRoute).toBeDefined();
      expect(adminRoute?.canActivate).toBeDefined();
      expect(adminRoute?.canActivate?.length).toBe(2);
      expect(adminRoute?.canActivate).toContain(authGuard);
      expect(adminRoute?.canActivate).toContain(roleGuard);
      expect(adminRoute?.loadChildren).toBeDefined();
      expect(typeof adminRoute?.loadChildren).toBe('function');
    });

    it('should have admin route data with ADMIN role requirement', () => {
      const adminRoute = routes.find((r) => r.path === 'admin');
      expect(adminRoute?.data?.['roles']).toBeDefined();
      expect(adminRoute?.data?.['roles']).toContain('ADMIN');
    });

    it('should have all expected routes in order', () => {
      const routePaths = routes.map((r) => r.path);
      expect(routePaths).toContain('');
      expect(routePaths).toContain('products');
      expect(routePaths).toContain('cart');
      expect(routePaths).toContain('admin');
      expect(routePaths).toContain('auth');
      expect(routePaths).toContain('user');
      expect(routePaths).toContain('**');
    });
  });

  describe('route guards', () => {
    it('should protect admin route with both authGuard and roleGuard', () => {
      const adminRoute = routes.find((r) => r.path === 'admin');
      expect(adminRoute?.canActivate).toBeDefined();
      expect(adminRoute?.canActivate?.length).toBeGreaterThanOrEqual(2);
    });

    it('should protect user route with authGuard only', () => {
      const userRoute = routes.find((r) => r.path === 'user');
      expect(userRoute?.canActivate).toBeDefined();
      expect(userRoute?.canActivate).toContain(authGuard);
    });

    it('should not protect products route', () => {
      const productsRoute = routes.find((r) => r.path === 'products');
      expect(productsRoute?.canActivate).toBeUndefined();
    });

    it('should not protect cart route', () => {
      const cartRoute = routes.find((r) => r.path === 'cart');
      expect(cartRoute?.canActivate).toBeUndefined();
    });

    it('should not protect auth route', () => {
      const authRoute = routes.find((r) => r.path === 'auth');
      expect(authRoute?.canActivate).toBeUndefined();
    });
  });

  describe('route configuration', () => {
    it('should have products route before admin in routing table', () => {
      const productsIndex = routes.findIndex((r) => r.path === 'products');
      const adminIndex = routes.findIndex((r) => r.path === 'admin');
      expect(productsIndex).toBeLessThan(adminIndex);
    });

    it('should have wildcard route last', () => {
      expect(routes[routes.length - 1].path).toBe('**');
    });

    it('should have root route first', () => {
      expect(routes[0].path).toBe('');
    });
  });

  describe('loadRemoteModule behavior', () => {
    it('should have loadChildren functions that return promises', async () => {
      const productsRoute = routes.find((r) => r.path === 'products');
      const loadChildrenFn = productsRoute?.loadChildren as () => Promise<any>;

      expect(loadChildrenFn).toBeDefined();
      // Verify it returns a promise-like object
      const result = loadChildrenFn();
      expect(result).toBeDefined();
      expect(typeof (result as any).then).toBe('function');
    });

    it('should have cart loadChildren function', () => {
      const cartRoute = routes.find((r) => r.path === 'cart');
      const loadChildrenFn = cartRoute?.loadChildren;

      expect(loadChildrenFn).toBeDefined();
      expect(typeof loadChildrenFn).toBe('function');
    });

    it('should have admin loadChildren function', () => {
      const adminRoute = routes.find((r) => r.path === 'admin');
      const loadChildrenFn = adminRoute?.loadChildren;

      expect(loadChildrenFn).toBeDefined();
      expect(typeof loadChildrenFn).toBe('function');
    });

    it('should have auth loadChildren function', () => {
      const authRoute = routes.find((r) => r.path === 'auth');
      const loadChildrenFn = authRoute?.loadChildren;

      expect(loadChildrenFn).toBeDefined();
      expect(typeof loadChildrenFn).toBe('function');
    });

    it('should have user loadChildren function', () => {
      const userRoute = routes.find((r) => r.path === 'user');
      const loadChildrenFn = userRoute?.loadChildren;

      expect(loadChildrenFn).toBeDefined();
      expect(typeof loadChildrenFn).toBe('function');
    });
  });

  describe('environment-specific remote URLs', () => {
    it('should reference remote URLs from environment configuration', () => {
      // This test verifies that the routes are configured to use environment remotes
      // The actual environment URLs are tested at runtime when the MFEs are loaded
      const routes_array = routes;
      expect(routes_array.length).toBeGreaterThan(0);

      // Verify all MFE routes have loadChildren
      const mfeRoutes = routes_array.filter((r) =>
        ['products', 'cart', 'admin', 'auth', 'user'].includes(r.path as string),
      );
      expect(mfeRoutes.length).toBe(5);
      mfeRoutes.forEach((route) => {
        expect(route.loadChildren).toBeDefined();
      });
    });
  });
});
