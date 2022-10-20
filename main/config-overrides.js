const { name } = require("./package");
const { ModuleFederationPlugin } = require("webpack").container;


module.exports = {
  webpack: (config) => {
    // config.output.globalObject = "window";

   config.plugins.push(
     new ModuleFederationPlugin({
       name: "main",
       // 这里指明需要加载的远程模块服务地址
       remotes: {
         remote: "remote@http://localhost:3000/remoteEntry.js",
         // components: "components@http://localhost:8002/remoteEntry.js",
       },
       // 指明需要共享的依赖
       shared: {
         react: {
           singleton: true,
           //  requiredVersion: dependencies["react"],
           // eager: true,
         },
         "react-dom": {
           singleton: true,
           //  requiredVersion: dependencies["react-dom"],
           // eager: true,
         },
       },
       // @ts-ignore
       //  exposes: {
       //    "./react": myResolver.resolveSync({}, process.cwd(), "react"),
       //  },
     })
   );

    return config;
  },

  // devServer: (_) => {
  //   const config = _;

  //   config.headers = {
  //     "Access-Control-Allow-Origin": "*",
  //   };
  //   config.historyApiFallback = true;
  //   config.hot = false;
  //   config.watchContentBase = false;
  //   config.liveReload = false;

  //   return config;
  // },
};
