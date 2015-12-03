module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'https://cdn.socket.io/socket.io-1.3.7.js',
      'src/index.js',
      'src/fb_config.js',
      'src/fb_util.js',
      'src/fb_instance_methods.js',
      'src/fb_events.js',
      'test/helpers/**/*.js',
      'test/**/*_test.js'
    ],
    preprocessors: {
      'src/**/*.js': 'coverage',
    },
    reporters: ['progress', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    concurrency: Infinity
  })
}
