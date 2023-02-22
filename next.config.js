const withAntdLess = require('next-plugin-antd-less');
const { default: Script } = require('next/script');

module.exports = withAntdLess({
  // modifyVars: { '@primary-color': '#04f' },
  // optional
  lessVarsFilePath: './styles/antd.less',
  // optional
  // lessVarsFilePathAppendToEndOfContent: false,
  // optional https://github.com/webpack-contrib/css-loader#object
  cssLoaderOptions: {},

  // Other Config Here...

  webpack(config) {
    config.module.rules.push({
      test: /\.(gif|svg|jpg|png)$/,
      loader: 'file-loader',
    });
    return config;
  },

  i18n: {
    locales: ['zh-CN', 'en-US'],
    defaultLocale: 'zh-CN',
  },
  images: {
    domains: ['static.ghost.org'],
  },
});
// const isProd = process.env.NODE_ENV === 'production'

// module.exports = {
//   // Use the CDN in production and localhost for development.
//   assetPrefix: isProd ? 'https://cdn.mydomain.com' : '',
// }