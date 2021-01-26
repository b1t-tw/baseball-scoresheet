const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const data = require('gulp-data');
const connect = require('gulp-connect');
const fs = require('fs');

sass.compiler = require('node-sass');

gulp.task('server', function () {
    connect.server({
        port: 3000,
        livereload: true,
        root: 'static'
    });

    gulp.src('src/sass/**/*.scss')
    .pipe(data((file) => {
      console.log("[build] "+file['history']);
    }))
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./static/assets/css'));

    gulp.src('src/**/index.pug')
    .pipe(data((file) => {
      console.log("[build] "+file['history']);
      const result = {
        index: require('./data/index.json'),
      };
      return result;
    }))
    .pipe(pug())
    .pipe(gulp.dest('./static/'))
    .pipe(connect.reload());

    gulp.watch(['src/**/*.pug', 'src/sass/**/*.scss', 'static/assets/js/*.js', 'data/*.json'], function(event){

      gulp.src('src/sass/**/*.scss')
      .pipe(data((file) => {
        console.log("[build] "+file['history']);
      }))
      .pipe(sass.sync().on('error', sass.logError))
      .pipe(gulp.dest('./static/assets/css'));

      gulp.src('src/**/index.pug')
      .pipe(data((file) => {
        console.log("[build] "+file['history']);
        const result = {
          index: require('./data/index.json'),
        };
        return result;
      }))
      .pipe(pug())
      .pipe(gulp.dest('./static/'))
      .pipe(connect.reload());
      event();
    });
});