var gulp = require('gulp');
var wrap = require('gulp-wrap-umd');

gulp.task('build', function(){
  gulp.src('src/index.js')
    .pipe(wrap({ namespace: 'Farmbot' }))
    .pipe(gulp.dest('dist/'));
});
