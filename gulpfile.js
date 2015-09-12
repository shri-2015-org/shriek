"use strict";

var gulp = require('gulp'),
	sass = require('gulp-ruby-sass'),
	useref = require('gulp-useref'),
	gulpif = require('gulp-if'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	minifyCss = require('gulp-minify-css'),
	livereload = require('gulp-livereload'),
	flatten = require('gulp-flatten'),
	wiredep = require('wiredep').stream;

var onError = function(err) {
	console.error(err);
}

// watcher

gulp.task('watch', function() {
	livereload.listen();
	gulp.watch(['app/assets/css/*.sass','app/assets/css/modules/*.sass'], ['sass']);
	gulp.watch(['bower.json'], ['bower']);
});

// wiredep

gulp.task('bower', function () {
	gulp.src('app/views/layouts/*.html')
		.pipe(wiredep({
			directory: "app/components"
		}))
	.pipe(gulp.dest('app/views/layouts'));
});

// sass

gulp.task('templates', function() {
	return gulp.src('app/assets/css/modules/*.sass')
	.pipe(concat('modules.sass'))
	.pipe(gulp.dest('app/assets/css/'));
});

gulp.task('sass', ['templates'], function() {
	return sass('app/assets/css/modules.sass', { style: 'compressed' })
	.pipe(rename('bundle.min.css'))
	.pipe(gulp.dest('public/assets/css'))
	.pipe(livereload());
});
