/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-param-reassign */
const rewiteReactHotLoader = require('react-app-rewire-hot-loader');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const path = require('path');

module.exports = function override(config, env) {
  config = rewiteReactHotLoader(config, env);

  config.resolve.alias = {
    ...config.resolve.alias,
    'react-dom': '@hot-loader/react-dom'
  };
  config.plugins = [
    ...config.plugins,
    new WebpackBuildNotifierPlugin({
      title: 'React Build',
      logo: path.resolve('./public/react.png')
    })
  ];

  return config;
};
