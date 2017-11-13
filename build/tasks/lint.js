module.exports = function(gulp, options, plugins) {

	gulp.task('lint', function() {
    return lint(options.config.src);
	});

  // Main lint function
  function lint(files) {
    return gulp.src(files)
      .pipe(plugins.gulpPlugins.eslint({
        configFile: '.eslintrc',
        quite: true,
        fix: false
       }))
      // .pipe(reload({stream: true, once: true}))
      .pipe(plugins.gulpPlugins.eslint.format())
      .pipe(plugins.gulpPlugins.eslint.failAfterError())
      .pipe(plugins.gulpPlugins.if(isFixed, gulp.dest('.', {cwd: './src' })));
  }

  function isFixed(file) {
    return file.eslint && file.eslint.fixed;
  }

};
