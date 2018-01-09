const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './client/index.jsx',
  devtool: '#sourcemap',
  output: {
    publicPath: '/',
    path: path.join(__dirname, 'public'),
    filename: 'app.js'
  },
  resolve: {
    extensions: [ '.js', '.jsx' ]
  },
  module: {
    rules: [
      {
        test: /\.worker\.js$/,
        use: [
          { loader: 'babel-loader' },
          { loader: 'worker-loader' }
        ],
        include: [
          path.join(__dirname, './client')
        ]
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [
          path.join(__dirname, './client')
        ]
      },
      {
        test: /\.css?$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' }
        ]
      }
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      title: 'TwitGraph'
    })
  ]
}
