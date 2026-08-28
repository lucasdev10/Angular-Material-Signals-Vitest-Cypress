export const environment = {
  production: true,
  apiUrl: 'https://api.coffeeworkshop.com',
  enableDebugTools: false,
  logLevel: 'error',
  remotes: {
    products: 'https://cdn.coffeeworkshop.com/products/remoteEntry.js',
    cart: 'https://cdn.coffeeworkshop.com/cart/remoteEntry.js',
    admin: 'https://cdn.coffeeworkshop.com/admin/remoteEntry.js',
    auth: 'https://cdn.coffeeworkshop.com/auth/remoteEntry.js',
    user: 'https://cdn.coffeeworkshop.com/user/remoteEntry.js',
  },
};
