const { name } = require("./package");
const { ModuleFederationPlugin } = require("webpack").container;
// const HtmlWebpackPlugin = require("html-webpack-plugin");
// const path = require("path");
const { dependencies } = require("./package.json");

module.exports = {
  webpack: (config) => {
    config.output.library = `${name}`;
    config.output.libraryTarget = "umd";
    // config.output.chunkLoadingGlobal​​​​​​​ = `webpackJsonp_${name}`;
    config.output.globalObject = "window";

    config.output.publicPath = "http://127.0.0.1:9002/";

    config.plugins.push(
      new ModuleFederationPlugin({
        name: "components",
        filename: "remoteEntry.js",
        library: { type: "umd", name: "components" },
        // 指明需要共享的依赖
        // shared: ["react", "react-dom"],
        // 这里配置需要导出的模块给其它应用共享
        exposes: {
          "./Button": "./src/Button",
        },
        shared: {
          react: {
            singleton: true,
            requiredVersion: dependencies["react"],
            eager: true,
          },
          "react-dom": {
            singleton: true,
            requiredVersion: dependencies["react-dom"],
          },
        },
      })
    );
    
    return config;
  },

  devServer: (_) => {
    const config = _;

    config.headers = {
      "Access-Control-Allow-Origin": "*",
    };
    config.historyApiFallback = true;
    config.hot = false;
    config.watchContentBase = false;
    config.liveReload = false;

    return config;
  },
};
