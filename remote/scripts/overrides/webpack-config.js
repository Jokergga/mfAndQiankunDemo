const { ModuleFederationPlugin } = require('webpack').container;

const webpackConfigPath = 'react-scripts/config/webpack.config';
const webpackConfig = require(webpackConfigPath);

const override = config => {
  config.plugins.push(new ModuleFederationPlugin(require('../../modulefederation.config.js')));

  // config.output.globalObject = "window";
  config.output.publicPath = 'http://127.0.0.1:3000/';

  config.output={
    library: {
       name: 'remote',
      type:'umd',
      // umdNamedDefine: true
    }
  }

  return config;
};

require.cache[require.resolve(webpackConfigPath)].exports = env => override(webpackConfig(env));

module.exports = require(webpackConfigPath);
