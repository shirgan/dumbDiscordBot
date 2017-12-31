module.exports = function(gulp, options, plugins) {

	gulp.task('serve:backend', function() {
    var pm2Options = './dist/backend/config/p2processes.json';
    if(process.argv[process.argv.length-1] === 'serve:backend'){
      console.error('*** No arguments specified for token, will attempt to run with pm2 json config only');
    } else {    
      var configFile = null;
      
      try {
        configFile = JSON.parse(plugins.fs.readFileSync(pm2Options, 'utf8'));
      } catch(e) {
        console.error("No config file found/parsed, (check the json file validity) aborting...");
        return;
      }
    
      var args = process.argv;
      var env = {};
      
      for(var i=0; i<args.length; i++){
        if(args[i].indexOf('--token') > -1) {
          var val = validArg(args[i]);
          if(val){
            env.clientId = val;
          }
        }
      }
      
      for(var i=0; i<configFile.length; i++) {
        configFile[i].env = env;
      }
      pm2Options = configFile;
    }
      
    return plugins.pm2.connect(true, function () {
        plugins.pm2.start(pm2Options, function () {
            console.log('pm2 started');
            plugins.pm2.dashboard();
            //pm2.streamLogs('all');
        });
    });
	});

  function validArg (ele) {
    var split = ele.split('=');
    if(split[1] !== undefined || split[1] !== null || split[1] !== '') {
      return split[1];
    }
    return false;
  }
};


