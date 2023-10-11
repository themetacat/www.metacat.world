// .babelrc.js
// module.exports = {
//   presets: [['next/babel']],
//   plugins: [['import', { libraryName: 'antd', style: true }]],
// };

 module.exports =module.exports = {
  presets: [require.resolve('next/babel')],
  plugins: [
    [
      require.resolve('babel-plugin-import'),
      { libraryName: 'foo' }
    ]
  ]
}