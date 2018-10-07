import winston from 'winston';
import fs from 'fs';
import path from 'path';

// Setup logging folder
export default function(module_name, loggingConfig) {

    let transports = [];

    transports.push(
        new (winston.transports.Console)({
            level: 'debug',
            colorize: loggingConfig.logColors
        })
    );

    // condition for writing to a file
    if(loggingConfig.writeToFile) {
        var logDir = path.join(__dirname, '../log/'); // directory path you want to set
        if ( !fs.existsSync( logDir ) ) {
            // Create the directory if it does not exist
            fs.mkdirSync( logDir );
        }

        transports.push(new (winston.transports.File)({filename: path.join(logDir, '/'+module_name+'.txt')}));
    }


    let logger = new (winston.Logger)({
        transports: transports
    });
    return logger;
};
