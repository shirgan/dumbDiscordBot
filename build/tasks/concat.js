module.exports = function(gulp, options, plugins) {
	gulp.task('concat:backend', function() {
    return gulp.src(options.config.destDir+"/backend/**/*.js").
    pipe(plugins.gulpPlugins.concat('dumbDiscordBot.js')).
    pipe(gulp.dest(options.config.targetDir));
	});


};


