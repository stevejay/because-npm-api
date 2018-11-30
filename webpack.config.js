"use strict";
const nodeExternals = require("webpack-node-externals");
const slsw = require("serverless-webpack");
const path = require("path");
const srcDir = path.join(__dirname, "src");
const nodeModulesDir = path.join(__dirname, "node_modules");

module.exports = {
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  entry: slsw.lib.entries,
  target: "node",
  optimization: { minimize: false },
  performance: { hints: false },
  devtool: "nosources-source-map",
  output: {
    libraryTarget: "commonjs2",
    path: path.join(__dirname, ".webpack"),
    filename: "[name].js",
    sourceMapFilename: "[file].map"
  },
  externals: [nodeExternals(), "aws-sdk"],
  module: {
    rules: [
      {
        test: /\.ts$/,
        enforce: "pre",
        use: ["tslint-loader"],
        include: srcDir
      },
      {
        test: /\.ts$/,
        include: srcDir,
        use: [
          {
            loader: "ts-loader",
            options: {
              silent: true
            }
          }
        ]
      },
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        include: srcDir,
        enforce: "pre"
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        use: [{ loader: "graphql-import-loader" }]
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
    modules: [srcDir, nodeModulesDir]
  }
};
