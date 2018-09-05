// Requires
var gulp = require('gulp');

// Include plugins
var sass = require('gulp-sass'),
  minifyCss = require('gulp-clean-css'),
  autoprefixer = require('gulp-autoprefixer'),
  useref = require('gulp-useref'),
  gulpif = require('gulp-if'),
  uglify = require('gulp-uglify'),
  imagemin = require('gulp-imagemin'),
  clean = require('gulp-clean'),
  fileinclude = require('gulp-file-include'),
  purgecss = require('gulp-purgecss'),
  plumber = require('gulp-plumber');


// Permet de construire un nouveau dossier dist a chaque gulp
gulp.task('clean', function () {
  return gulp.src('dist', {
    read: false
  }).pipe(clean())
});

// tâche CSS = compile le style
gulp.task('exportCSS', function () {
  return gulp.src('./src/scss/style.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(purgecss({
      content: ["src/**/*.html"]
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('src/css/'));
});

// Constitution des fichiers HTML
gulp.task('exportHTML', function () {
  return gulp.src(['src/html/*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file',
    }))
    .pipe(gulp.dest('./src/'));
});

gulp.task('fonts', ['clean', 'exportCSS', 'exportHTML'], function () {
  return gulp.src('./src/fonts/*.*')
    .pipe(gulp.dest('dist/fonts'));
});

// Minifie les images
gulp.task('img', ['fonts'], function () {
  return gulp.src('src/medias/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/medias'))
});

gulp.task('default', ['img'], function () {
  return gulp.src('src/*.html')
    .pipe(useref())
    .pipe(gulpif('*.css', minifyCss()))
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulp.dest('dist'));
});

// Watcher de mon style
gulp.task('watch', function () {
  gulp.watch(['./src/scss/**/*.scss'], ['exportCSS']);
});
