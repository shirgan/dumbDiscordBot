module.exports = function(gulp, options, plugins) {
  gulp.task('pre-test', () => {
    return gulp.src(options.config.src)
      // gulp-jasmine works on filepaths so you can't have any plugins before it 
      .pipe(plugins.gulpPlugins.istanbul({
        instrumenter: plugins.isparta.Instrumenter
      }))
      .pipe(plugins.gulpPlugins.istanbul.hookRequire());
  });
  
  
  
  gulp.task('ci', ['pre-test'], () => {
    return gulp.src(options.config.test)
      // gulp-jasmine works on filepaths so you can't have any plugins before it 
      .pipe(plugins.gulpPlugins.jasmine())
      .pipe(plugins.gulpPlugins.istanbul.writeReports({
        dir: options.config.destDir + '/coverage'
      }))
      //.pipe(plugins.gulpPlugins.istanbul.enforceThresholds({ thresholds: { global: 90 } }))
      .once('end', function () {
          process.kill(process.pid, 'SIGINT');
          setTimeout(function() {
              /* eslint-disable */
              process.exit(0);
              /* eslint-enable */
          }, 100);
      });
  });
  
  gulp.task('test', () => {
    return gulp.src(options.config.test)
      .pipe(plugins.gulpPlugins.jasmine({
        verbose: true
      }))
      .once('end', function () {
          process.kill(process.pid, 'SIGINT');
          setTimeout(function() {
              /* eslint-disable */
              process.exit(0);
              /* eslint-enable */
          }, 100);
      });
  });
  
};
