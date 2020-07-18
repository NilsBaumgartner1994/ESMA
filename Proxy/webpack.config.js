var nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',
  externals: [
    nodeExternals({modulesFromFile: true,})
  ],
  entry: ['babel-polyfill','./src/index.js'],
  node: {
    fs: 'empty',
    child_process: 'empty',
  },
  output: {
    path: __dirname + "/src",
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};
