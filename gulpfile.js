const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();

gulp.task('sass', () => {
    return gulp.src('./src/sass/**/*.scss')
        .pipe(sass.sync({ outputStyle: "expanded" }).on('error', sass.logError))
        .pipe(gulp.dest('./src/css/'))
});

gulp.task('default', () => {
    gulp.watch('./src/sass/**/*.scss', gulp.series('sass', browserSync.reload));
    gulp.watch('./**/*.html', browserSync.reload);
    browserSync.init({
        server: {
            baseDir: './'
        }
    })
})