var gulp = require('gulp'),
    wrap = require('gulp-wrap-umd'),
    minify = require('gulp-minify'),
    SRC_PATH = 'src/farmbot.js',
    UMD_CONFIG = wrap({ namespace: 'Farmbot' }),
    BUILD_PATH = gulp.dest('dist/');

gulp.task('build', function() {
    var lib = gulp
                .src(SRC_PATH)
                .pipe(UMD_CONFIG);

    var minifiedLib = lib.pipe(minify());

    lib.pipe(BUILD_PATH);
    minifiedLib.pipe(BUILD_PATH);
});
