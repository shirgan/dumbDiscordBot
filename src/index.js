'use strict';

const {EventEmitter} = require('events');
import * as di from './config';
import { asValue } from 'awilix';
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
  logger.error('Unhandled Exception', err);
});

process.on('uncaughtRejection', (err, promise) => {
  logger.error('Unhandled Rejection', err);
});

process.on('unhandledRejection', (err, promise) => {
  logger.error('Unhandled Rejection', err);
});

mediator.on('discord.ready', (bootstrapContainer, connectionsContainer) => {
  logger.info('Discord client logged in');
  const discordDi = connectionsContainer.resolve('discord');
  client.connect(mediator, discordDi)
    .then(clientRepo => {
      messageBlaster.connect(mediator, discordDi, bootstrapContainer)
        .then(messageRepo => {
          logger.info('MessageBlaster has connected.');
          
          imageBlaster.connect(mediator, discordDi, bootstrapContainer) 
            .then(imageRepo => {
              logger.info ('ImageBlaster has connected.');
                
              soundBlaster.connect(mediator, discordDi)
                .then(soundRepo => {
                  logger.info('SoundBlaster has connected.');
                  
                  voiceListener.connect(mediator, discordDi) 
                    .then(voiceRepo => {
                      logger.info ('VoiceListener has connected.');
                  
                    return server.start({
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
