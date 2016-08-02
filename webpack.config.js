module.exports = {
  entry: './src/farmbot.ts',
  output: {
    libraryTarget: "umd",
    // library: "Farmbot",
    filename: './dist/farmbot.js'
  },
  // Want to try this:
  externals: {
    'mqtt': 'mqtt'
  },
  resolve: {
    extensions: ['', '.js', '.ts']
  },
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  }
}
