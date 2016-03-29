module.exports = {
  entry: './src/farmbot.ts',
  output: {
    libraryTarget: "umd",
    // library: "Farmbot",
    filename: './dist/farmbot.js'
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
