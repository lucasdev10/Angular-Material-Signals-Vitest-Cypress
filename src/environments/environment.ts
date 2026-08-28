export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  enableDebugTools: true,
  logLevel: 'debug',
  remotes: {
    products: 'http://localhost:4201/remoteEntry.js',
    cart: 'http://localhost:4202/remoteEntry.js',
    admin: 'http://localhost:4203/remoteEntry.js',
    auth: 'http://localhost:4204/remoteEntry.js',
    user: 'http://localhost:4205/remoteEntry.js',
  },
};
