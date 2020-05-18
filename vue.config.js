const path = require('path')

module.exports = {

configureWebpack:   {
    test: /\.sass$/,
    use: [
      'vue-style-loader',
      'css-loader',
      {
        loader: 'sass-loader',
        options: {
          indentedSyntax: true
        }
      }
    ]
  }
  /*chainWebpack: (config) => {
    config
      .module
      .rule('scss')
      .use('sass-resources-loader')
      .loader('sass-resources-loader')
      .options({
        resources: [
          path.resolve('./src/assets/css/_variables.scss'),
          //path.resolve('./src/scss/_mixins.scss')
        ]
      })
  },*/

  publicPath: process.env.NODE_ENV === 'production'
  ? '/exam/admin/'
  : '/'
}