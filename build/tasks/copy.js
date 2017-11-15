module.exports = function(gulp, options, plugins) {

	gulp.task('copy:backend', function() {
    return gulp.src(options.config.backEndTemplates).
    pipe(gulp.dest(options.config.destDir+"/backend"));
	});
  
	gulp.task('copy:backendCompile', function() {
    return gulp.src(options.config.backEndsrc).
    pipe(plugins.gulpPlugins.flatten()).
    pipe(gulp.dest(options.config.targetDir+"/backend"));
	});
};
