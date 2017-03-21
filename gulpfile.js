const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const mocha = require('gulp-mocha');
const watch = require('gulp-watch');

require('babel-core/register');

var jsFiles = ['src/*.js', '*.js', 'tests/*.js'];

gulp.task('build', () => {
    return gulp.src('src/*')
        .pipe(babel({
            plugins: ['transform-runtime'],
            presets: ['es2015']
        }))
        .pipe(gulp.dest('lib'));
});


gulp.task('watch', ['build'], () => {
    return watch(jsFiles, { ignoreInitial: false }, () => {
        gulp.src('tests/WechatPaymentForWeb.test.js', { read: false })
            // gulp-mocha needs filepaths so you can't have any plugins before it
            .pipe(mocha())
    });
});

gulp.task('test', () => {
    gulp.src('tests/WechatPaymentForWeb.test.js', { read: false })
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha())
});
