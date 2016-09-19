module.exports = {
  entry: './src/farmbot.ts',
  output: {
    libraryTarget: "umd",
    filename: './dist/farmbot.js'
  },
  externals: { 'mqtt': 'mqtt' },
  resolve: {
    extensions: ['', '.js', '.ts']
  },
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  }
}
