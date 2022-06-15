const { src, dest, watch, series } = require('gulp')
const sass = require('gulp-sass')(require('sass'));
const purgecss = require('gulp-purgecss')

// compiles sass and creates a css directory
function buildStyles() {
  return src('samobi/**/*.scss')
    .pipe(sass())
    .pipe(purgecss({ content: ['*.html']}))
    .pipe(dest('css'))
}

// watches changes in sass files
function watchTask() {
    watch(['samobi/**/*.scss', '*.html'], buildStyles)
}

exports.default = series(buildStyles, watchTask)