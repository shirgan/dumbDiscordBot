module.exports = function(gulp, options, plugins) {

	gulp.task('lint', function() {
    return gulp.src(options.config.backEndsrc)
      .pipe(plugins.gulpPlugins.eslint({
        configFile: '.eslintrc',
        quite: true,
        fix: false
       }))
      // .pipe(reload({stream: true, once: true}))
      .pipe(plugins.gulpPlugins.eslint.format())
      .pipe(plugins.gulpPlugins.eslint.failAfterError());
      //.pipe(plugins.gulpPlugins.if(isFixed, gulp.dest('.', {cwd: './src' })));
	});
};
