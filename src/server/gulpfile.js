// Dependencies
'use strict';
const gulp = require('gulp');
const gutil = require('gulp-util');
const babelify = require('babelify');
const concat = require('gulp-concat');
const browserify = require('browserify');
const exec = require('child_process').exec;
const spawn = require('child_process').spawn;
const minifycss = require('gulp-minify-css');
const source = require('vinyl-source-stream');
const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf8');
let server = null;

const fs = require('fs');
const path = require('path');
const gofiles = fs.readdirSync(__dirname).filter(e => path.extname(e) === '.go');

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
        transform: [[babelify, { presets: ['es2015', 'react'] }]],
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
    gutil.log(gutil.colors.red('[Spawning server]...'));
    server = spawn('go', ['run', ...gofiles]);
    server.stdout.on('data', (data) => process.stdout.write(decoder.write(data)));
    server.stderr.on('data', (data) => process.stdout.write(decoder.write(`stderr: ${data}`)));
    server.on('close', (code) => process.stdout.write(decoder.write(`Server exited with code ${code}`)));
});

gulp.task('restart-server', function() {
    if(server !== null) {
        server.stdin.pause();
        server.kill();
        server = null;
    }
    gutil.log(gutil.colors.red('[Respawning server]...'));
    server = spawn('go', ['run', ...gofiles]);
    server.stdout.on('data', (data) => process.stdout.write(decoder.write(data)));
    server.stderr.on('data', (data) => process.stdout.write(decoder.write(`stderr: ${data}`)));
    server.on('close', (code) => process.stdout.write(decoder.write(`Server exited with code ${code}`)));
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
