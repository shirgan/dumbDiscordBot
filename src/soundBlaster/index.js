'use strict';
import fs from 'fs';
import path from 'path';

const soundController = (mediator, discordClient) => {
  let discordMessageObj = null;
  let discordConnectionObj = null;
  let discordVoiceChannel = null;
  let soundQueue = [];
  //let randoSoundFiles = [];
  
  // sounds
  let randoFilePath = path.join(__dirname, '../assets/sounds/rando');
  let hoorsFilePath = path.join(__dirname, '../assets/sounds/hoors');
  let dootFilePath = path.join(__dirname, '../assets/sounds/doot');
  
  // images
  let departureImagesPath = path.join(__dirname, '../assets/images');

  const generateSoundFileList = (dir) => {
    return fs.readdirSync(dir)
    .map(file => {
      return path.join(dir, file);
    }); 
  };
  
  let randoSoundFiles = generateSoundFileList(randoFilePath);
  let hoorsSoundFiles = generateSoundFileList(hoorsFilePath);
  let dootSoundFiles = generateSoundFileList(dootFilePath);
  let departureImageFiles = generateSoundFileList(departureImagesPath);
  
  const soundTriggerListner = (options) => {
    
    //const {} = options;
    return new Promise((resolve, reject) => {   // lol
      discordClient.on('message', message => {
        if (message.content === '!rando') {
          joinVoiceChannel(message).then(() => {
            addToQueue(getRandomFile(randoSoundFiles));
          });
        } else if (message.content === '!hoors' || message.content === '!hoor') {
          joinVoiceChannel(message).then(() => {
            addToQueue(getRandomFile(hoorsSoundFiles));
          });
        } else if (message.content === '!doot') {
          joinVoiceChannel(message).then(() => {
            addToQueue(getRandomFile(dootSoundFiles));
          });
        }
      });
    });
  };
  
  
  const soundProcessor = (options, soundObj) => {
    mediator.on('soundBlaster:newSound', (value) => {
      mediator.removeAllListeners('soundBlaster:halt', () => { return; });
      mediator.emit('generic.log', 'Playing sound: '+ soundQueue[value].fileName);
      const dispatcher = discordConnectionObj.playFile(soundQueue[value].fileName);
      
      mediator.on('soundBlaster:halt', () => {
        dispatcher.end();
      });
      
      dispatcher.on('end', () => {
        playNextSoundInQueue()
      });
    });
  }
  
  const joinVoiceChannel = (message) => {
    return new Promise((resolve, reject) => {
      if (message.member.voiceChannel) {
        message.member.voiceChannel.join()
        .then(connection => { // Connection is an instance of VoiceConnection
          discordMessageObj = message;
          discordVoiceChannel = message.member.voiceChannel;
          discordConnectionObj = connection;
          
          mediator.emit('generic.log', 'Joined voice channel: '+ discordVoiceChannel.name);
          
          resolve();
        })
        .catch(console.log);
        
      } else {
        message.reply('Dude, you need to be in a voice channel to here me!');
        reject();
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
  
  const playNextSoundInQueue = () => {
    soundQueue.splice(0, 1);    // remove the first element and re-shuffle
    
    if (soundQueue.length != 0 ){
      mediator.emit('soundBlaster:newSound', 0);
    } else {
      let chance = Math.floor(Math.random()*3);
      console.log(chance);
      if(chance === 2) {
        discordMessageObj.channel.send("swag out", {
          files: [
            getRandomFile(departureImageFiles)
          ]
        });
      }
      
      mediator.emit('generic.log', 'Leaving voice channel: '+ discordVoiceChannel.name);
      discordVoiceChannel.leave();
    }
  };
  
  let getRandomFile = (items) => {
    return items[Math.floor(Math.random()*items.length)];
  };

  return Object.create({
    soundTriggerListner,
    soundProcessor,
    soundHalter
  });
};


const connect = (mediator, connection) => {
  return new Promise((resolve, reject) => {
    if(!connection) {
      reject(new Error('No discord object supplied!'));
    }
    resolve(soundController(mediator, connection));
  });
}

export {connect};