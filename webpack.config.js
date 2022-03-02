const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require("webpack");
const isProduction = process.env.NODE_ENV == "production";
module.exports = {
  devtool: 'inline-source-map',
  entry: './src/index.tsx',
  mode: process.env.NODE_ENV,
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  cache: {
    type: 'filesystem',
    allowCollectingMemory: true,
    buildDependencies: {
      // This makes all dependencies of this file - build dependencies
      config: [__filename],
      // By default webpack and loaders are build dependencies
    },
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devServer: {
    static: './dist',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css?$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.less?$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: false
            }
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: !isProduction,
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ["postcss-import"],
                sourceMap: isProduction
              }
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: isProduction
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      }
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      React: 'react',
    }),
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new HtmlWebpackPlugin({
      templateContent: `<div id='root'></div>`
    }),
    new MiniCssExtractPlugin()
  ]
};