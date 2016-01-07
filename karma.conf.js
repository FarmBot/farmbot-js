module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            'dist/farmbot-min.js',
            // 'dist/farmbot.js',
            // 'src/farmbot.js',
            'test/helpers.js',
            'test/**/*_test.js'
        ],
        preprocessors: {
            'src/**/*.js': 'coverage',
        },
        reporters: [
            'coverage',
            'spec'
        ],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        singleRun: true,
        concurrency: Infinity
    })
}
