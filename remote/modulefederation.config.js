const { dependencies } = require("./package.json");

module.exports = {
  name: "remote",
  exposes: {
    "./Button": "./src/Button",
    "./react": "react",
    "./react-dom": "react-dom",
  },
  filename: "remoteEntry.js",
  library: {
    name: "remote",
    type: "umd",
    // umdNamedDefine: true
  },
  shared: {
    // ...dependencies,
    react: {
      singleton: true,
      requiredVersion: dependencies["react"],
    },
    "react-dom": {
      singleton: true,
      requiredVersion: dependencies["react-dom"],
    },
  },
};
