'use strict';

import fs from 'fs';
import path from 'path';

const soundController = (mediator, connectionsContainer, bootstrapContainer) => {
  const logger = bootstrapContainer.resolve('logger');
  const discordClient = connectionsContainer.resolve('discord');
  let soundTriggers = [];
  let imageFiles = [];
  let mixFiles = new Map();

  let discordMessageObj = null;
  let discordConnectionObj = null;
  let discordVoiceChannel = null;
  let soundQueue = [];
  
  let getRandomFile = (items) => {
    return items[Math.floor(Math.random() * items.length)];
  };
  
  const shuffle = (array) => {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  const prepPluginSoundFile = (obj) => {
    // Only shuffle sounds once they have all been looped through
    if(obj.curIndex === obj.sounds.length || obj.curIndex < 0){
      obj.curIndex = 0;
      obj.sounds = shuffle(obj.sounds);
    }
    
    addToQueue(obj.sounds[obj.curIndex]);
    obj.curIndex++;
  };

  
  const Observer = function() {
    return {
      notify: function(message) {
      mediator.emit('generic.log', message.content);
      if(message.content === "!mix") {
        joinVoiceChannel(message).then(() => {
          playMixSound();
      });
      } else {
          // run it against the plugins
          for (let i = 0; i < soundTriggers.length; i++) {
            const triggers = soundTriggers[i].keyword;
            for (let j = 0; j < triggers.length; j++) {
              if (message.content === triggers[j]) {
                joinVoiceChannel(message).then(() => {
                  prepPluginSoundFile(soundTriggers[i]);
                });
              }
            }
          }
        }
      }
    };
  };

  const playMixSound = () => {
    var category = Array.from(mixFiles.keys())[Math.floor(Math.random() * Array.from(mixFiles.keys()).length)];
    mediator.emit('generic.log', 'Mix category: '+ category);
    addToQueue(getRandomFile(mixFiles.get(category).get('1')));
    addToQueue(getRandomFile(mixFiles.get(category).get('2')));
  }

  const mergeSoundTriggers = (sndList) => {
    let addedCount = 0;
    for (let i = 0; i < soundTriggers.length; i++) { // All current sounds
      for( let j = 0; j < soundTriggers[i].keyword.length; j++ ) { // All current sounds trigger arr
        if( sndList.keyword.indexOf(soundTriggers[i].keyword[j]) > -1) {
          // If trigger already exists, merge the sounds
          soundTriggers[i].sounds = soundTriggers[i].sounds.concat(sndList.sounds);
          addedCount++;
        }
      }      
    }
    if(addedCount > 0) {
      return true;
    }
    return false;
  };

  const loadMixSounds = () => {
    const categories = fs.readdirSync(path.join(__dirname, '../assets/mix'));
    // Mix sounds are in files named <category>-<num>. There should be a 1 and 2 for each category.
    for(let i in categories) {
      // Get the information about this category
      const categoryPath = path.join(__dirname, '../assets/mix', categories[i]);
      const categoryName = categories[i].split("-")[0];
      const categoryNum = categories[i].split("-")[1];
      const soundsNames = fs.readdirSync(categoryPath);
      const sounds = soundsNames.map(x => path.join(categoryPath, x))
      // If we haven't seen this category yet, add it to the mapFiles dict.
      if(!mixFiles.has(categoryName)) {
        mixFiles.set(categoryName, new Map());
      }
      if(sounds.length > 0) {
        mixFiles.get(categoryName).set(categoryNum, sounds);
      }
      logger.warn(`Mix category ${categories[i]} loaded.`);
    }
    // Delete empty or partial categories
    for(let i of mixFiles) {
      if(!i[1].has('1') || !i[1].has('2')) {
        mixFiles.delete(i[0]);
        logger.warn(`Removed empty mix category ${i[0]}.`);
      }
    }
  };
  
  const soundProcessor = (options, soundObj) => {
    const plugins = options.pluginsRepo.getPlugins();
    for (let i = 0; i < plugins.length; i++) {
      const soundList = plugins[i].triggers.sound;
      imageFiles = imageFiles.concat(plugins[i].imagePool);
      for ( let j = 0; j < soundList.length; j++ ) {
        // merge on a sound by sound basis
        if( !mergeSoundTriggers(soundList[j])) {
          soundTriggers.push(soundList[j]);
        };
      }
    }

    loadMixSounds();

    let observer = new Observer();
    options.messageRepo.subject.subscribeObserver(observer, 'SoundBlaster');
    
    mediator.on('soundBlaster:newSound', (value) => {
      mediator.removeAllListeners('soundBlaster:halt', () => { return; });
      mediator.emit('generic.log', 'Playing sound: '+ soundQueue[value].fileName);
      const dispatcher = discordConnectionObj.playFile(soundQueue[value].fileName);
      
      mediator.on('soundBlaster:halt', () => {
        dispatcher.end();
      });
      
      dispatcher.on('end', () => {
        playNextSoundInQueue(options);
      });
    });
  };
  
  const joinVoiceChannel = (message) => {
    return new Promise((resolve, reject) => {
      if (message.member.voiceChannel) {
        if (message.member.voiceChannel.permissionsFor(discordClient.user).has('CONNECT')) {
          if (message.member.voiceChannel !== discordVoiceChannel) {
            message.member.voiceChannel.join()
            .then(connection => { // Connection is an instance of VoiceConnection
              discordMessageObj = message;
              discordVoiceChannel = message.member.voiceChannel;
              discordConnectionObj = connection;
              
              mediator.emit('generic.log', 'Joined voice channel: '+ discordVoiceChannel.name);
              
              resolve();
            });
          } else {
            resolve();
          }
        } else {
          message.reply(`I do not have permission to join ${message.member.voiceChannel}`);
        }
        
      } else {
        message.reply('Dude, you need to be in a voice channel to hear me!');
      }
    });
  };
  
  const addToQueue = (filename) => {
    if(!soundQueue.length) {
      soundQueue.push({fileName: filename});
      mediator.emit('soundBlaster:newSound', 0);  // probably not efficent, but oh well
    } else {
      soundQueue.push({fileName: filename});
    }
  };
  
  const soundHalter = () => {
    discordClient.on('message', message => {
      if (message.content === '!stop') {
        mediator.emit('generic.log', 'Halting all playing sounds...');
        soundQueue = []; // dump all queued items
        mediator.emit('soundBlaster:halt');
      }
    });
  };
  
  const playNextSoundInQueue = (options) => {
    soundQueue.splice(0, 1);    // remove the first element and re-shuffle
    
    if (soundQueue.length != 0 ){
      mediator.emit('soundBlaster:newSound', 0);
    } else {
      
      setTimeout(() => {
        if (soundQueue.length === 0) {
          let chance = Math.floor(Math.random()*10);
          if(chance === 9) {
            discordMessageObj.channel.send('swag out', {
              files: [
                getRandomFile(imageFiles)
              ]
            });
          }
          if(options.global.stickyVoiceChannel === false) {
            mediator.emit('generic.log', 'Leaving voice channel: '+ discordVoiceChannel.name);
            discordVoiceChannel.leave();
            //reset vars so that the bot is happy
          }
          discordMessageObj = null;
          discordVoiceChannel = null;
          discordConnectionObj = null; 
        }
      }, 1500);
    }
  };

  return Object.create({
    soundProcessor,
    soundHalter
  });
};

const connect = (mediator, connectionsContainer, bootstrapContainer) => {
  return new Promise((resolve, reject) => {
    if(!connectionsContainer) {
      reject(new Error('No discord object supplied!'));
    }
    resolve(soundController(mediator, connectionsContainer, bootstrapContainer));
  });
};

export {connect};
