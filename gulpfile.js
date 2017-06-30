/* eslint-disable no-console */
/* eslint-disable no-multi-spaces */

// Includes - Defining what will be used below.
// These are pulled in from the node_modules folder.
var path = require('path');
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var livereload = require('gulp-livereload');
var insert = require('gulp-insert');
var rollup = require('gulp-rollup-stream');
var resolve = require('rollup-plugin-node-resolve');
var common = require('rollup-plugin-commonjs');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var gutil = require('gulp-util');
var uglifyES = require('uglify-es');
var composer = require('gulp-uglify/composer');
var uglify = composer(uglifyES, console);

// Uglify JS - Targets all .js files in the _js folder and converts
// them to functionally identical code that uses less bytes in the _scripts folder
gulp.task('uglifyCodepen', ['rollupCodepen'], function () {
    gulp.src('src/rolledCodepen.js')
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(insert.append('\n'))
        .pipe(gulp.dest('src'));
});

gulp.task('uglifyExtension', ['rollupExtension'], function () {
    gulp.src(['dist/rolledExtension.js', 'dist/background.js'])
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(insert.append('\n'))
        .pipe(gulp.dest('dist'));
});

gulp.task('uglifyAnyBrowserScript', ['rollupAnyBrowserScript'], function () {
    gulp.src('dist/rolledAnyBrowserScript.js')
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(insert.append('\n'))
        .pipe(gulp.dest('dist'));
});

gulp.task('rollupCodepen', function () {
    return gulp.src('src/codepen.js')
        .pipe(rollup({
            format: 'iife',
            moduleName: 'rolledFinal',
            plugins: [
                resolve({jsnext: true}),
                common({
                    namedExports: {
                        'node_modules/jquery/dist/jquery.js': [ 'jquery' ]
                    }
                })
            ]
        }))
        .pipe(rename('rolledCodepen.js'))
        .pipe(gulp.dest('src'));
});

gulp.task('rollupExtension', function () {
    return gulp.src('src/gus-markdown-extension.js')
        .pipe(rollup({
            format: 'iife',
            moduleName: 'rolledExtension',
            plugins: [
                resolve({jsnext: true}),
                common()
            ]
        }))
        .pipe(rename('rolledExtension.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('rollupAnyBrowserScript', function () {
    return gulp.src('src/anyBrowserScript.js')
        .pipe(rollup({
            format: 'iife',
            moduleName: 'rolledAnyBrowserScript',
            plugins: [
                resolve({jsnext: true}),
                common()
            ]
        }))
        .pipe(rename('rolledAnyBrowserScript.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('copyBackground', function () {
    return gulp.src('src/background.js')
        .pipe(gulp.dest('dist'));
});

gulp.task('processSass', function () {
    gulp.src('src/styles/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist/styles'));
});

// Lint the main.js file to ensure code consistency and catch any errors
gulp.task('lint', function () {
    gulp.src(['src/**/*.js', 'gulpfile.js'])
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task('fix', function () {
    gulp.src(['gulpfile.js'])
        .pipe(eslint({fix: true}))
        .pipe(eslint.format())
        .pipe(gulp.dest(''));

    gulp.src(['src/**/*.js'])
        .pipe(eslint({fix: true}))
        .pipe(eslint.format())
        .pipe(gulp.dest('src'));
});

// Run a local server on port 8000
gulp.task('serve', ['uglifyCodepen'], function (done) {
    var express = require('express');
    var app = express();
    //path to the folder that will be served. __dirname is project root
    var url = path.join(__dirname);
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

gulp.task('js', ['uglifyCodepen'], function () {
    gulp.src('src/*.js')
        .pipe(livereload());
});

gulp.task('css', function () {
    gulp.src('src/**/*.css')
        .pipe(livereload());
});

// Watch for changes in JS, and HTML files, then Lint,
// Uglify and reload the browser automatically
gulp.task('watch', function () {
    gulp.watch('src/!(rolledCodepen).js', ['js']);
    gulp.watch('src/*.html', ['html']);
    gulp.watch('src/**/*.css', ['css']);

    livereload.listen();
});

// Automatically opens the local server in your default browser
gulp.task('open', ['serve'], function () {
    var url = 'http://localhost:8000/src';
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
gulp.task('default', ['lint', 'uglifyCodepen', 'watch', 'serve', 'open']);

gulp.task('buildExtension', ['lint', 'processSass', 'copyBackground', 'uglifyExtension']);

gulp.task('buildAnyBrowserScript', ['lint', 'uglifyAnyBrowserScript']);

gulp.task('all', ['default', 'buildExtension', 'buildAnyBrowserScript']);
