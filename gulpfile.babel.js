// This is the gulp file for the cos-web yeoman generator package. 
// The build folder contains the dependencies for this file

// Required
var gulp = require('gulp');
var fs = require('fs');

require('@babel/register');

const gulpLoadPlugins = require('gulp-load-plugins');
const isparta = require('isparta');
const reporter = require('jasmine-reporters');
const sequencer = require('run-sequence');

// Configuration
import buildConfig from './build/config';

// Scripts  //
let options = {
	pattern: ['build/tasks/**/*.js'],
	config: buildConfig.config
};

let plugins = {
  gulpPlugins: gulpLoadPlugins(),
  fs: fs,
  isparta: isparta,
  reporter: reporter
}

require ('load-gulp-tasks')(gulp, options, plugins);

// build task
gulp.task('build', (callback) => sequencer('clean','copy:backend','babel:backend'));

// Default task
gulp.task('default', function() {
  console.log('No arguments provided.');
});