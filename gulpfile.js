var gulp = require('gulp');
var source = require('vinyl-source-stream');
var watchify = require('watchify');

gulp.task('default', function() {
    // Default task
    // Compile js (browserify)
    // Compile sass (compass)
});

gulp.task('tests', function() {
    // Execute tests
    // Mocha
});

gulp.task('watch', function() {
    // Watch files for changes and rebuild
    var bundler = watchify('./app/app.js');

    bundler.transform('hbsfy');

    bundler.on('update', rebundle);

    function rebundle() {
        return bundler.bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./server/static/lib'));
    }

    // Compile sass (compass)
    return(rebundle());
});