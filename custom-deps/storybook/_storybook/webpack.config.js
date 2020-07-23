const path = require("path");
const pathResolve = (p) => path.resolve(__dirname, "../", p);
module.exports = ({ config, mode }) => {
  config.resolve.extensions.push(
    ".ts",
    ".tsx",
    ".vue",
    ".css",
    ".less",
    ".scss",
    ".sass",
    ".html"
  );
  config.resolve.alias = {
    ...config.resolve.alias,
    "@": pathResolve("src"),
    assets: pathResolve("src/assets"),
    "~": pathResolve("node_modules"),
  };
  config.module.rules.push({
    test: /\.scss$/,
    oneOf: [
      {
        include: pathResolve("src"),
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
          "sass-loader",
        ],
      },
      {
        include: pathResolve("src"),
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  });
  config.module.rules.push({
    test: /\.vue$/,
    loader: "storybook-addon-vue-info/loader",
    enforce: "post",
  });
  config.module.rules.push({
    test: /\.stories\.js$/,
    loaders: [require.resolve("@storybook/addon-storysource/loader")],
    enforce: "pre",
  });
  config.module.rules.push({
    test: /\.ts$/,
    exclude: /node_modules/,
    use: [
      {
        loader: "ts-loader",
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
      },
    ],
  });
  if (process.env.NODE_ENV === "production") {
    config.output.filename = "bundle.[name].js";
    config.optimization.splitChunks.automaticNameDelimiter = ".";
    config.optimization.runtimeChunk = {
      name: (entrypoint) => `runtime.${entrypoint.name}`,
    };
  }
  // console.log(config);
  return config;
};
