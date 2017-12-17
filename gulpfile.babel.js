// This is the gulp file for the cos-web yeoman generator package. 
// The build folder contains the dependencies for this file


// Required
var gulp = require('gulp');

const gulpLoadPlugins = require('gulp-load-plugins');
//const $ = gulpLoadPlugins();  //gulp-load-plugins will attempt to include all gulp related plugins fro node_modules


// Configuration
import buildConfig from './build/config';
import pm2 from 'pm2';

// load the individual tasks

// Scripts  //
// The scripts below can be invoked using the task names as agruments

let options = {
	pattern: ['build/tasks/**/*.js'],
	config: buildConfig.config
};

let plugins = {
  gulpPlugins: gulpLoadPlugins(),
  pm2: pm2
}

//let loadedGulpTasks = loadGulpTasks('build/tasks', gulp, options, plugins);
require ('load-gulp-tasks')(gulp, options, plugins);

// build task
gulp.task('build:backend', () => runSequential(['clean', 'copy:backend', 'babel:backend']));

gulp.task('compile', () => runSequential(['clean', 'copy:backendCompile', 'copy:backend', 'babel:backendCompile']));

// Default task
gulp.task('default', function() {
  console.log('Uh... forgot your argument!');
});


function runSequential( tasks ) {
  if( !tasks || tasks.length <= 0 ) return;

  const task = tasks[0];
  gulp.start( task, () => {
      console.log( `${task} finished` );
      runSequential( tasks.slice(1) );
  } );
}
