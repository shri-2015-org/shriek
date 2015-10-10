'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var nano = require('gulp-cssnano');
var bower = require('gulp-bower');
var wiredep = require('wiredep').stream;
var prefix = require('gulp-autoprefixer');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var reactify = require('reactify');

var path = {
  HTML: 'app/views/layouts/index.html',
  MINIFIED_OUT: 'assets/js/components.min.js',
  REACT_COMPONENTS: 'app/views/components/*.jsx',
  ALT_ACTIONS: 'app/actions/*.js',
  ALT_STORES: 'app/stores/*.js',
  OUT: 'app/assets/js/components.js',
  SASS_FILE: 'app/assets/css/*.sass',
  DEST: 'public',
  DEST_BUILD: 'public',
  DEST_SRC: 'dist/assets',
  ENTRY_POINT: 'app/assets/js/app.jsx',
  BOWER_DIR: 'app/components',
  IMGS: 'app/assets/img/**/*'
};

gulp.task('default', ['bower', 'sass', 'build', 'watch']);

// watch

gulp.task('watch', function () {
  gulp.watch([path.SASS_FILE], ['sass']);
  gulp.watch(['bower.json'], ['bower']);
  gulp.watch([
    path.ENTRY_POINT,
    path.REACT_COMPONENTS,
    path.ALT_ACTIONS,
    path.ALT_STORES
  ], ['build']);
});

// wiredep (bower)

gulp.task('bower', ['bowerInstall'], function () {
  gulp.src(path.HTML)
    .pipe(wiredep())
    .pipe(gulp.dest('./public'));
});

gulp.task('bowerInstall', function () {
  return bower({cmd: 'update'});
});

// react components

gulp.task('build', function () {
  browserify({
    entries: [path.ENTRY_POINT],
    transform: [reactify]
  })
    .on('error', function (err) {console.log(err);})
    .bundle()
    .pipe(source(path.MINIFIED_OUT))
    .pipe(gulp.dest(path.DEST_BUILD));
});

// fontawesome

gulp.task('icons', function () {
  return gulp.src(path.BOWER_DIR + '/fontawesome/fonts/**.*')
    .pipe(gulp.dest('./public/assets/fonts'));
});

gulp.task('fontawesome', ['icons'], function () {
  return gulp.src(path.BOWER_DIR + '/fontawesome/css/*.min.css')
    .pipe(gulp.dest('./public/assets/css'));
});

// images
gulp.task('images', function () {
  return gulp.src(path.IMGS)
    .pipe(gulp.dest('./public/assets/img'));
});

// sass

gulp.task('sass', ['fontawesome', 'images'], function () {
  return gulp.src('app/assets/css/**/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('bundle.min.css'))
    .pipe(prefix({browsers: ['last 2 version']}))
    .pipe(nano())
    .pipe(gulp.dest('./public/assets/css'));
});
