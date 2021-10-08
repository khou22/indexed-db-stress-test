/* config-overrides.js */

module.exports = {
  webpack: (config) => {
    config.module.rules.unshift({
      test: /\.worker\.ts$/,
      use: {
        loader: "worker-loader",
        options: {
          filename: "static/js/[name].[contenthash:8].js",
        },
      },
    });

    config.module.rules.unshift({
      test: /\.shared-worker\.ts$/,
      use: {
        loader: "shared-worker-loader",
        options: {
          filename: "static/js/[name].[contenthash:8].js",
        },
      },
    });

    return config;
  },
};
