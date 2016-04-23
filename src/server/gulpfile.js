// Dependencies
var gulp = require('gulp');
var babelify = require('babelify');
var concat = require('gulp-concat');
var browserify = require('browserify');
var minifycss = require('gulp-minify-css');
var source = require('vinyl-source-stream');
var Server = require('golang-server-reload');

// Minify the css files into a bundle for an easy require
gulp.task('bundle-styles', function() {
    return gulp.src(['../styles/*.css',
                     '../styles/**/*.css',
                     '../styles/components/**/*.css'])
        .pipe(concat('bundle.css'))
        .pipe(minifycss())
        .pipe(gulp.dest('../dist'));
});

// Build the React ES6 scripts/components with browserify and babelify
gulp.task('build-scripts', function() {
    return browserify({
        entries: '../scripts/index.js',
        transform: [[babelify, {presets: ['es2015', 'react']}]],
        extensions: ['.jsx, .js'],
        nonull: true,
        debug: true
    })
    .bundle()
    .on('error', function(err) {
        console.log(err.message);
        this.emit('end');
    })
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('../dist'));
});

// Live-reload the Golang server
gulp.task('start-server', function() {
    server = new Server('github.com/askwon/courier/src/server/', '../server/', './server')
    server.serve(1337, 8081);
});

gulp.task('restart-server', function() {
    server.serve(1337, 8081);
});

// Watch for any changes in the source files (both frontend and backend)
gulp.task('watch', ['bundle-styles', 'build-scripts'], function() {
    gulp.watch(['../scripts/App.jsx',
                '../scripts/**/*.*', 
                '../js/filet.js',
                '../index.html'], ['build-scripts']);
    gulp.watch(['../styles/*.css', 
               '../styles/**/*.css',
               '../styles/components/**/*.css'], ['bundle-styles']);
    gulp.watch('./*.go', ['restart-server']);
});

// Default task
gulp.task('default', ['watch', 'start-server']);
