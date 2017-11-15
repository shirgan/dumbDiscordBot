module.exports = function(gulp, options, plugins) {

  gulp.task('babel:backend', function() {
    return gulp.src(options.config.backEndsrc).
    pipe(plugins.gulpPlugins.babel()).
    pipe(gulp.dest(options.config.destDir+"/backend"));
  });

  gulp.task('babel:backendCompile', function() {
    return gulp.src(options.config.src).
    pipe(plugins.gulpPlugins.babel()).
    pipe(plugins.gulpPlugins.concat('dumbDiscordBot.js')).
    pipe(gulp.dest(options.config.targetDir+"/backend"));
  });
};
