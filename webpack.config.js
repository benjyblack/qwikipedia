module.exports = {
  entry: './js/qwikipedia.js',
  output: {
    path: __dirname,
    filename: 'dist/qwikipedia.js'
  },
  module: {
    loaders: [
      { test: /qwikipedia\.js/, loader: 'babel-loader' },
      { test: /\.css$/, loader: 'style!css' },
      { test: /jquery\.js$/, loader: 'expose?$' },
      { test: /jquery\.js$/, loader: 'expose?jQuery' }
    ]
  }
};