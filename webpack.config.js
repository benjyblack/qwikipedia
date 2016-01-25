module.exports = {
  entry: './js/qwikipedia.js',
  output: {
    path: __dirname,
    filename: 'dist/qwikipedia.js'
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style!css' },
      { test: /qwikipedia\.js/, loader: 'babel-loader' },
      { test: /jquery\.js$/, loader: 'expose?$' },
      { test: /jquery\.js$/, loader: 'expose?jQuery' }
    ]
  }
};