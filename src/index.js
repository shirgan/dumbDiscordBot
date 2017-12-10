'use strict';

const {EventEmitter} = require('events');
import * as config from './config/';
import * as soundBlaster from './soundBlaster/index';
import * as messageBlaster from './messageBlaster/index';
import * as imageBlaster from './imageBlaster/index';
import * as voiceListener from './voiceListener';
import * as client from './client/index';
import * as server from './server/server';

import logging from './logger/logging.module';


/* other stuff here */
const mediator = new EventEmitter();
var logger = logging('dumbDiscordBot-service');


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

mediator.on('discord.ready', (discord) => {
  logger.info("Discord client logged in.");
  client.connect(mediator, discord)
    .then(clientRepo => {
      
      messageBlaster.connect(mediator, discord)
        .then(messageRepo => {
          logger.info("MessageBlaster has connected.");
          
          imageBlaster.connect(mediator, discord, config) 
            .then(imageRepo => {
              logger.info ("ImageBlaster has connected.");
                
              soundBlaster.connect(mediator, discord)
                .then(soundRepo => {
                  logger.info("SoundBlaster has connected.");
                  
                  voiceListener.connect(mediator, discord) 
                    .then(voiceRepo => {
                      logger.info ("VoiceListener has connected.");
                  
                    return server.start({
                      messageRepo,
                      imageRepo,
                      soundRepo,
                      clientRepo,
                      voiceRepo
                    });
                  }).then(app => {
                    logger.info("Dumb Discord Bot Service started successfully.");
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
config.discord.connect(config.discordClientSettings, mediator);
//config.imap.connect(config.locateSettings.imap, mediator);

// emit that the service stript has finished
mediator.emit('boot.ready');
