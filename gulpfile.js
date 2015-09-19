"use strict";

var gulp = require('gulp'),
  sass = require('gulp-ruby-sass'),
  useref = require('gulp-useref'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  bower = require('gulp-bower'),
  wiredep = require('wiredep').stream,
  prefix = require('gulp-autoprefixer'),
  source = require('vinyl-source-stream'),
  browserify = require('browserify'),
  reactify = require('reactify'),
  streamify = require('gulp-streamify');

var onError = function(err) {
  console.error(err);
}

var path = {
  HTML: 'app/views/layouts/index.html',
  MINIFIED_OUT: 'assets/js/components.min.js',
  REACT_COMPONENTS: 'app/views/components/*.jsx',
  OUT: 'app/assets/js/components.js',
  SASS_FILE: 'app/assets/css/*.sass',
  SASS_MODULES: 'app/assets/css/modules/*.sass',
  DEST: 'public',
  DEST_BUILD: 'public',
  DEST_SRC: 'dist/assets',
  ENTRY_POINT: 'app/assets/js/app.jsx',
  BOWER_DIR: 'app/components'
};


gulp.task('default', ['bower', 'sass', 'build', 'watch']);

// watch

gulp.task('watch', function () {
  gulp.watch([path.SASS_FILE, path.SASS_MODULES], ['sass']);
  gulp.watch(['bower.json'], ['bower']);
  gulp.watch([path.ENTRY_POINT, path.REACT_COMPONENTS], ['build']);
});

// wiredep (bower)

gulp.task('bower', ['bowerInstall'], function () {
  gulp.src(path.HTML)
    .pipe(wiredep())
    .pipe(gulp.dest('./public'));
});

gulp.task('bowerInstall', function () {
  return bower({ cmd: 'update'});
});

// react components

gulp.task('build', function (){
  browserify({
    entries: [path.ENTRY_POINT],
    transform: [reactify]
  })
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

// sass

gulp.task('templates', function () {
  return gulp.src('app/assets/css/modules/*.sass')
    .pipe(concat('modules.sass'))
    .pipe(gulp.dest('app/assets/css/'));
});

gulp.task('sass', ['fontawesome', 'templates'], function () {
  return sass('app/assets/css/modules.sass', {style: 'compressed'})
    .pipe(prefix({ browsers: ['last 2 version'] }))
    .pipe(rename('bundle.min.css'))
    .pipe(gulp.dest('./public/assets/css'));
});
