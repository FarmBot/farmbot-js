var gulp = require('gulp'),
    wrap = require('gulp-wrap-umd'),
    minify = require('gulp-minify');

gulp.task('build', function() {
    gulp.src('src/farmbot.js')
        .pipe(wrap({
            namespace: 'Farmbot'
        }))
        .pipe(minify())
        .pipe(gulp.dest('dist/'));
});
