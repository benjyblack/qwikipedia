const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const gutil = require('gulp-util');

gulp.task('build', () => {
  const b = browserify({
    entries: './qwikipedia.js',
    debug: true
  });

  return b
    .transform(babelify)
    .bundle()
    .pipe(source('qwikipedia.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(uglify())
      .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('default', () => {
  gulp.watch('qwikipedia.js', ['build']);
});