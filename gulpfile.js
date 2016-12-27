/**
 * Created by M. Yegorov on 2016-12-23.
 */

const gulp = require('gulp')
const shell = require('gulp-shell')
const rimraf = require('gulp-rimraf')

gulp.task('default', ['process-styles', 'babel-win'], () => {

})

/*gulp.task('clean', () => {
    gulp.src('./lib/!*').pipe(rimraf())
})*/

gulp.task('process-styles', () => {
    gulp.src('./src/*.css')
        .pipe(gulp.dest('./lib/'))
})

gulp.task('babel-win', () => {
    gulp.src('', {read: false})
        .pipe(shell('node node_modules/babel-cli/bin/babel.js ./src --out-dir ./lib --source-maps'))
})