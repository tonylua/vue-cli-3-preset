const path = require("path");
const pathResolve = (p) => path.resolve(__dirname, "../", p);

module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/preset-scss",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
  ],
  webpackFinal: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": pathResolve("src"),
      assets: pathResolve("src/assets"),
      "~": pathResolve("node_modules"),
      // "@/router/router.ts": pathResolve("__mocks__/fakeRouter"),
    };
    return config;
  },
  babel: (config) => ({
    ...(process.env.NODE_ENV !== "production"
      ? config
      : (function (cfg) {
          cfg.output.filename = "bundle.[name].js";
          cfg.optimization.splitChunks.automaticNameDelimiter = ".";
          cfg.optimization.runtimeChunk = {
            name: (entrypoint) => `runtime.${entrypoint.name}`,
          };
          return cfg;
        })(config)),
    extends: pathResolve("babel.config.js"),
  }),
};
