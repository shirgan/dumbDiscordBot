module.exports = function(gulp, options, plugins) {

	gulp.task('serve:backend', function() {
    return plugins.pm2.connect(true, function () {
        plugins.pm2.start('dist/processes.json', function () {
            console.log('pm2 started');
            plugins.pm2.dashboard();
            //pm2.streamLogs('all');
        });
    });
	});


};


