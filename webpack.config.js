module.exports = {
  entry: './window-animations',
  output: {
    filename: 'extension.js',
    libraryTarget: 'umd',
  },
  module: {
    loaders: [{
      loader: 'babel-loader',
      test: /\.js$/,
      exclude: /node_modules/,
    }],
  },
};
