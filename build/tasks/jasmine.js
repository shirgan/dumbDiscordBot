module.exports = function(gulp, options, plugins) {

  gulp.task('ci', () =>
    gulp.src(options.config.test)
      // gulp-jasmine works on filepaths so you can't have any plugins before it 
      .pipe(plugins.gulpPlugins.jasmine())
      .pipe(plugins.gulpPlugins.istanbul.writeReports({
        dir: options.config.destDir + '/coverage'
      }))
      .pipe(plugins.gulpPlugins.istanbul.enforceThresholds({ thresholds: { global: 90 } }))
  );
  
  gulp.task('test', () =>
    gulp.src(options.config.test)
      // gulp-jasmine works on filepaths so you can't have any plugins before it 
      .pipe(plugins.gulpPlugins.jasmine())
  );
  
  gulp.task('pre-test', () =>
    gulp.src(options.config.src)
      // gulp-jasmine works on filepaths so you can't have any plugins before it 
      .pipe(plugins.gulpPlugins.istanbul())
      //.pipe(plugins.gulpPlugins.istanbul.hookRequire())
  );
};
