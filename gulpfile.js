(function () {
   'use strict';
}());

// include gulp
var gulp = require('gulp'); 

// include plug-ins
var sass = require('gulp-sass');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var connect = require('gulp-connect');
var changed = require('gulp-changed');
var imagemin = require('gulp-imagemin');
var cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
var minifyHTML = require('gulp-minify-html');
var stripDebug = require('gulp-strip-debug');
var autoprefix = require('gulp-autoprefixer');


// JS hint task
gulp.task('jshint', function() {
  gulp.src('./src/scripts/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// minify new images
gulp.task('imagemin', function() {
  var imgSrc = './src/images/**/*',
      imgDst = './build/images';

  gulp.src(imgSrc)
    .pipe(changed(imgDst))
    .pipe(imagemin())
    .pipe(gulp.dest(imgDst));
});

// minify new or changed HTML pages
gulp.task('htmlpage', function() {
  var htmlSrc = './src/templates/*.html',
      htmlDst = './build/templates';

  gulp.src(htmlSrc)
    .pipe(changed(htmlDst))
    .pipe(minifyHTML())
    .pipe(gulp.dest(htmlDst));
});

// JS concat, strip debugging and minify
gulp.task('scripts', function() {
  gulp.src(['./src/scripts/lib.js','./src/scripts/*.js'])
    .pipe(concat('sedna.js'))
    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(gulp.dest('./build/scripts/'));
});

// CSS concat, auto-prefix and minify
gulp.task('styles', function() {
  gulp.src(['./src/styles/*.css'])
    .pipe(concat('styles.css'))
    .pipe(autoprefix('last 2 versions'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('./build/styles/'));
});

gulp.task('webserver', function() {
  connect.server({
    livereload: true,
    port: 3000,
    root: 'build',
    host: 'localhost'
  });
});

gulp.task('sass', function () {
  return gulp.src('./src/styles/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./build/styles'));
});

gulp.task('sass', function () {
	return gulp.src('./src/styles/*.scss')
	  .pipe(sourcemaps.init())
	  .pipe(sass().on('error', sass.logError))
	  .pipe(sourcemaps.write('./maps'))
	  .pipe(gulp.dest('./build/styles'));
});


// default gulp task
gulp.task('default', ['imagemin', 'htmlpage', 'scripts', 'webserver', 'sass'], function() {
	 // watch for HTML changes
  gulp.watch('./src/templates/*.html', function() {
    gulp.run('htmlpage');
  });

  // watch for JS changes
  gulp.watch('./src/scripts/*.js', function() {
    gulp.run('jshint', 'scripts');
  });

  // watch for CSS changes
  gulp.watch('./src/styles/*.css', function() {
    gulp.run('styles');
  });

  // watch for SASS and SCSS
  gulp.watch('./src/styles/*.scss', function () {
	  gulp.run('sass');
	});

});