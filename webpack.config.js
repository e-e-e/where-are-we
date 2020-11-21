const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const pkg = require('./package.json')

const devMode = process.env.NODE_ENV !== 'production'
module.exports = {
  mode: devMode ? 'development' : 'production',
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  output: {
    filename: `${pkg.name}.${pkg.version}.js`,
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: './dist',
    port: 4000,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-transform-async-to-generator'
            ],
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: '> 0.25%, not dead'
                }
              ]
            ]
          }
        }
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.(jpg|png)$/,
        use: {
          loader: 'url-loader'
        }
      },
      {
        test: /\.svg$/,
        use: {
          loader: 'raw-loader'
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Where Am I',
      template: './src/index.html.ejs'
    })
  ]
}
