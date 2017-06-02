/* eslint-disable no-console */
/* eslint-disable no-multi-spaces */

// Includes - Defining what will be used below.
// These are pulled in from the node_modules folder.
var path = require('path');
var gulp = require('gulp');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var livereload = require('gulp-livereload');
var uglify = require('gulp-uglify');
var insert = require('gulp-insert');
var clean = require('gulp-clean');

// Basic error logging function to be used below
function errorLog (error) {
    console.log('error');
    console.error.bind(error);
    this.emit('end');
}

// Uglify JS - Targets all .js files in the _js folder and converts
// them to functionally identical code that uses less bytes in the _scripts folder
gulp.task('uglify', ['concat'], function () {
    return gulp.src('src/concatenated.js')
        .pipe(uglify())
        .on('error', errorLog)
        .pipe(insert.append('\n'))
        .pipe(gulp.dest('src'));
});

gulp.task('clean', function () {
    return gulp.src('src/concatenated.js', {read: false})
        .pipe(clean())
})

gulp.task('concat', ['clean'], function () {
    return gulp.src(["node_modules/jquery/dist/jquery.js", "node_modules/marked/lib/marked.js", "src/texttransform.js", "src/!(gus-markdown.js|*.html|texttransform.js)"])
        .pipe(concat('concatenated.js'))
        .pipe(gulp.dest('src'));
})

// Lint the main.js file to ensure code consistency and catch any errors
gulp.task('lint', function () {
    return gulp.src('src/**/!(concatenated).js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Run a local server on port 8000
gulp.task('serve', ['uglify'], function (done) {
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

gulp.task('js', ['uglify'], function () {
    gulp.src('src/*.js')
        .pipe(livereload());
});

// Watch for changes in JS, and HTML files, then Lint,
// Uglify and reload the browser automatically
gulp.task('watch', function () {
    gulp.watch('src/!(concatenated).js', ['lint', 'uglify', 'js']);
    gulp.watch('src/*.html', ['html']);

    livereload.listen();
});

// Automatically opens the local server in your default browser
gulp.task('open', ['serve'], function () {
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
gulp.task('default', ['lint', 'concat', 'uglify', 'watch', 'serve', 'open']);
