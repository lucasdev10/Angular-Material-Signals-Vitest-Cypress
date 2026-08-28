export const environment = {
  production: true,
  apiUrl: 'https://api.coffeeworkshop.com',
  enableDebugTools: false,
  logLevel: 'error',
  remotes: {
    products: 'https://mfe-products.coffeeworkshop.com/remoteEntry.js',
    cart: 'https://mfe-cart.coffeeworkshop.com/remoteEntry.js',
    admin: 'https://mfe-admin.coffeeworkshop.com/remoteEntry.js',
    auth: 'https://mfe-auth.coffeeworkshop.com/remoteEntry.js',
    user: 'https://mfe-user.coffeeworkshop.com/remoteEntry.js',
  },
};
