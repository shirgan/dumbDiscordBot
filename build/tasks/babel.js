module.exports = function(gulp, options, plugins) {

  gulp.task('babel:backend', function() {
    return gulp.src(options.config.backEndsrc).
    pipe(plugins.gulpPlugins.babel()).
    pipe(gulp.dest(options.config.destDir+"/backend"));
  });
};
