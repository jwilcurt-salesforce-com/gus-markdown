/* eslint-disable no-console */
/* eslint-disable no-multi-spaces */

// Includes - Defining what will be used below.
// These are pulled in from the node_modules folder.
var path = require('path');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var livereload = require('gulp-livereload');
var uglify = require('gulp-uglify');
var insert = require('gulp-insert');

// Basic error logging function to be used below
function errorLog (error) {
    console.error.bind(error);
    this.emit('end');
}

// Uglify JS - Targets all .js files in the _js folder and converts
// them to functionally identical code that uses less bytes in the _scripts folder
gulp.task('uglify', function () {
    gulp.src('src/**/*.js')
        .pipe(uglify())
        .on('error', errorLog)
        .pipe(insert.append('\n'))
        .pipe(gulp.dest('dist'));
});

// Lint the main.js file to ensure code consistency and catch any errors
gulp.task('lint', function () {
    return gulp.src('src/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Run a local server on port 8000
gulp.task('serve', function (done) {
    var express = require('express');
    var app = express();
    //path to the folder that will be served. __dirname is project root
    var url = path.join(__dirname, 'src');
    app.use(express.static(url));
    app.listen(8000, function () {
        done();
    });
});

// Enable live reload listening from HTML files in the browser
// if you have the LiveReload browser extension installed.
gulp.task('html', function () {
    gulp.src('src/*.html')
        .pipe(livereload());
});

// Watch for changes in JS, and HTML files, then Lint,
// Uglify and reload the browser automatically
gulp.task('watch', function () {
    gulp.watch('src/**/*.js', ['lint']);
    gulp.watch('src/**/*.js', ['uglify']);
    gulp.watch('src/*.html', ['html']);

    livereload.listen();
});

// Automatically opens the local server in your default browser
gulp.task('open', function () {
    var url = 'http://localhost:8000';
    var OS = process.platform;
    var executable = '';

    //OS Specific values for opening files.
    if (OS == 'darwin') { executable = 'open "' + url + '"'; }
    if (OS == 'linux')  { executable = 'xdg-open ' + url;    }
    if (OS == 'win32')  { executable = 'explorer ' + url;    }

    //Run the OS specific command to open the url in the default browser
    require('child_process').exec(executable);
});

// The default Gulp task that happens when you run gulp.
// It runs all the other gulp tasks above in the correct order.
gulp.task('default', ['lint', 'uglify', 'watch', 'serve', 'open']);
