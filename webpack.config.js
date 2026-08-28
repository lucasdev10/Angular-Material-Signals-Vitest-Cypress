const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const mf = require('@angular-architects/module-federation/webpack');
const path = require('path');
const share = mf.share;

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
  path.join(__dirname, 'tsconfig.json'),
  [/* mapped paths to share */],
);

module.exports = {
  output: {
    uniqueName: 'shell',
    publicPath: 'auto',
  },
  optimization: {
    runtimeChunk: false,
  },
  resolve: {
    alias: {
      ...sharedMappings.getAliases(),
    },
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',
      filename: 'remoteEntry.js',
      remotes: {
        products: 'products@http://localhost:4201/remoteEntry.js',
        cart: 'cart@http://localhost:4202/remoteEntry.js',
        admin: 'admin@http://localhost:4203/remoteEntry.js',
        auth: 'auth@http://localhost:4204/remoteEntry.js',
        user: 'user@http://localhost:4205/remoteEntry.js',
      },
      shared: share({
        '@angular/animations': {
          singleton: true,
          strictVersion: false,
          requiredVersion: '21.1.0',
        },
        '@angular/cdk': {
          singleton: true,
          strictVersion: false,
          requiredVersion: '21.1.5',
        },
        '@angular/common': {
          singleton: true,
          strictVersion: false,
          requiredVersion: '21.1.0',
        },
        '@angular/compiler': {
          singleton: true,
          strictVersion: false,
          requiredVersion: '21.1.0',
        },
        '@angular/core': {
          singleton: true,
          strictVersion: false,
          requiredVersion: '21.1.0',
        },
        '@angular/forms': {
          singleton: true,
          strictVersion: false,
          requiredVersion: '21.1.0',
        },
        '@angular/material': {
          singleton: true,
          strictVersion: false,
          requiredVersion: '21.1.5',
        },
        '@angular/platform-browser': {
          singleton: true,
          strictVersion: false,
          requiredVersion: '21.1.0',
        },
        '@angular/platform-browser-dynamic': {
          singleton: true,
          strictVersion: false,
          requiredVersion: '21.1.0',
        },
        '@angular/router': {
          singleton: true,
          strictVersion: false,
          requiredVersion: '21.1.0',
        },
        '@ngrx/effects': {
          singleton: true,
          strictVersion: false,
          requiredVersion: '21.0.1',
        },
        '@ngrx/store': {
          singleton: true,
          strictVersion: false,
          requiredVersion: '21.0.1',
        },
        rxjs: {
          singleton: true,
          strictVersion: false,
          requiredVersion: '7.8.0',
        },
        tslib: {
          singleton: true,
          strictVersion: false,
          requiredVersion: '2.3.0',
        },
        ...sharedMappings.getDescriptors(),
      }),
      extraOptions: {
        sharedMappings,
      },
    }),
  ],
};
