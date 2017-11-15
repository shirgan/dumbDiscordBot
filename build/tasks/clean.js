module.exports = function(gulp, options, plugins) {
	gulp.task('clean', function() {
	   	const del = require('del');
		return del(['dist/**/*', 'target/**/*']);
	});
};

