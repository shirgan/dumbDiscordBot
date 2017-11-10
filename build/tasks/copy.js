module.exports = function(gulp, options, plugins) {

	gulp.task('copy:backend', function() {
    return gulp.src(options.config.backEndTemplates).
    pipe(gulp.dest(options.config.destDir+"/backend"));
	});
};
