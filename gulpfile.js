var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var react = require('gulp-react');
var htmlreplace = require('gulp-html-replace');

var path = {
  HTML: 'src/index.html',
  ALL: ['src/components/*.js', 'src/components/**/*.js', 'src/index.html', 'src/components/*.jsx', 'src/components/**/*.jsx', 'src/index.html'],
  JS: ['src/components/*.js', 'src/components/**/*.js', 'src/components/*.jsx', 'src/components/**/*.jsx'],
  MINIFIED_OUT: 'build.min.js',
  DEST_SRC: 'dist/src',
  DEST_BUILD: 'dist/build',
  DEST: 'dist'
};

// Transform the React JSX into JS
gulp.task('transform', function() {
	gulp.src(path.JS)
		.pipe(react())
		.pipe(gulp.dest(path.DEST_SRC));
});

// Take index.html file and copy over to dist 
gulp.task('copy', function() {
    gulp.src(path.HTML)
        .pipe(gulp.dest(path.DEST));
});

// Create a task that will always be running to update code in the dist folder
gulp.task('watch', function() {
    gulp.watch(path.ALL, ['transform', 'copy']);
});

// Set up a default task 
gulp.task('default', ['watch']);
