import winston from 'winston';
import fs from 'fs';
import path from 'path';

// Setup logging folder
module.exports = function(module_name) {
  
  var logDir = path.join(__dirname, '../../log/'); // directory path you want to set
  if ( !fs.existsSync( logDir ) ) {
      // Create the directory if it does not exist
      fs.mkdirSync( logDir );
  }
  return new (winston.Logger)({
      level: 'debug',
      transports: [
          new (winston.transports.Console)({
              colorize: 'all'
          }),
          new (winston.transports.File)({filename: path.join(logDir, '/'+module_name+'.txt')})
      ]
  });
};
