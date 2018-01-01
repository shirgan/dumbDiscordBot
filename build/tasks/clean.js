module.exports = function(gulp, options, plugins) {
	gulp.task('clean', () => {
	   	const del = require('del');
		return del(['dist/**/*', 'target/**/*']);
	});

};

