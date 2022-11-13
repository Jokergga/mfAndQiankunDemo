const { name } = require("./package.json");
const { ModuleFederationPlugin } = require("webpack").container;
const { dependencies } = require("./package.json");

module.exports = {
  webpack: (config) => {
    config.output.library = `${name}-[name]`;
    config.output.libraryTarget = "umd";
    // config.output.chunkLoadingGlobal​​​​​​​ = `webpackJsonp_${name}`;
    // config.output.globalObject = "window";
    config.output.publicPath = "http://127.0.0.1:9000/";

    config.plugins.push(
      new ModuleFederationPlugin({
        name: "app-bar",
        // library: { type: "umd", name: "app-bar" },
        // library: { type: "umd", name: "app-bar" },
        // 这里指明需要加载的远程模块服务地址
        remotes: {
          remote: "remote@http://localhost:3000/remoteEntry.js",
          // components: "components@http://localhost:8002/remoteEntry.js",
        },
        // 指明需要共享的依赖
        // shared: ["react", "react-dom"],
        shared: {
          react: {
            singleton: true,
            requiredVersion: dependencies["react"],
            // eager: true,
          },
          "react-dom": {
            singleton: true,
            requiredVersion: dependencies["react-dom"],
            // eager: true,
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
