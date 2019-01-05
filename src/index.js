'use strict';

const {EventEmitter} = require('events');
import * as di from './config';
import { asValue } from 'awilix';
import * as pluginBlaster from './pluginBlaster';
import * as soundBlaster from './soundBlaster/index';
import * as messageBlaster from './messageBlaster/index';
import * as imageBlaster from './imageBlaster/index';
import * as voiceListener from './voiceListener';
import * as client from './client/index';
import * as server from './server/server';

import logging from './logger/logging.module';


/* other stuff here */
const mediator = new EventEmitter();
var logger = logging('dumbDiscordBot-service', di.logSettings);


logger.info('--- Dumb Discord Bot Service ---');
logger.info('Loading configuration...');

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', err);
});

process.on('uncaughtRejection', (err, promise) => {
  logger.error('Unhandled Rejection', err);
  process.exit(230);
});

process.on('unhandledException', (err, promise) => {
  logger.error('Unhandled Rejection', err);
});

process.on('unhandledRejection', (err, promise) => {
  logger.error('Unhandled Rejection', err);
});

mediator.on('discord.ready', (bootstrapContainer, connectionsContainer) => {
  bootstrapContainer.register('logger', asValue(logger));
  logger.info('Discord client logged in');
  client.connect(mediator, connectionsContainer, bootstrapContainer)
    .then(clientRepo => {
      pluginBlaster.connect(mediator, connectionsContainer, bootstrapContainer)
        .then(pluginsRepo => {
          messageBlaster.connect(mediator, connectionsContainer, bootstrapContainer)
            .then(messageRepo => {
              logger.info('MessageBlaster has connected.');
              
              imageBlaster.connect(mediator, connectionsContainer, bootstrapContainer)
                .then(imageRepo => {
                  logger.info ('ImageBlaster has connected.');
                    
                  soundBlaster.connect(mediator, connectionsContainer, bootstrapContainer)
                    .then(soundRepo => {
                      logger.info('SoundBlaster has connected.');
                      
                      voiceListener.connect(mediator, connectionsContainer, bootstrapContainer)
                        .then(voiceRepo => {
                          logger.info ('VoiceListener has connected.');
                      
                        return server.start({
                          pluginsRepo,
                          messageRepo,
                          imageRepo,
                          soundRepo,
                          clientRepo,
                          voiceRepo
                        });
                      }).then(app => {
                        logger.info('Dumb Discord Bot Service started successfully.');
                      });
                      
                    });
                });
            });
        });
    });
});

mediator.on('discord.error', (err) => {
  logger.error(err);
});

mediator.on('generic.error', (err) => {
  logger.error(err);
});

mediator.on('generic.log', (msg) => {
  logger.verbose(msg);
});

// get the db connection queue
di.init(mediator);

// emit that the service stript has finished
mediator.emit('init', logger);
