'use strict';
import fs from 'fs';
import path from 'path';

const soundController = (mediator, discordClient) => {
  let discordMessageObj = null;
  let discordConnectionObj = null;
  let discordVoiceChannel = null;
  let soundQueue = [];
  
  const generateSoundFileList = (dir) => {
    return fs.readdirSync(dir)
    .filter(file => {
        return path.extname(file).match("^(\.(wav|mp3))$")
    })
    .map(file => {
        return path.join(dir, file);
    });
  };

  const generateImageFileList = (dir) => {
    return fs.readdirSync(dir)
    .map(file => {
        return path.join(dir, file);
    });
  };
  
  let getRandomFile = (items) => {
    return items[Math.floor(Math.random()*items.length)];
  };
  
  // sounds
  let randoFilePath = path.join(__dirname, '../assets/sounds/rando');
  let hoorsFilePath = path.join(__dirname, '../assets/sounds/hoors');
  let dootFilePath = path.join(__dirname, '../assets/sounds/doot');
  let beepFilePath = path.join(__dirname, '../assets/sounds/beep');
  let lolFilePath = path.join(__dirname, '../assets/sounds/lol');
  let gotemPath = path.join(__dirname, '../assets/sounds/gotem/');
  let dukeFile = path.join(__dirname, '../assets/sounds/rando/Duke_Alex_Hollis_02.wav');
  let rimshotFile = path.join(__dirname, '../assets/sounds/rimshot/rim.mp3');
  let city14Path = path.join(__dirname, '../assets/sounds/city14')
  let h3h3Path = path.join(__dirname, '../assets/sounds/h3h3')

  // images
  let departureImagesPath = path.join(__dirname, '../assets/images');
  
  let randoSoundFiles = generateSoundFileList(randoFilePath);
  let hoorsSoundFiles = generateSoundFileList(hoorsFilePath);
  let dootSoundFiles = generateSoundFileList(dootFilePath);
  let beepSoundFiles = generateSoundFileList(beepFilePath);
  let lolSoundFiles = generateSoundFileList(lolFilePath);
  let gotemSoundFiles = generateSoundFileList(gotemPath);
  let city14SoundFiles = generateSoundFileList(city14Path);
  let h3h3SoundFiles = generateSoundFileList(h3h3Path);
  let departureImageFiles = generateImageFileList(departureImagesPath);

  
  const Observer = function() {
    return {
      notify: function(message) {
        
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
        } else if (message.content === '!beep') {
          joinVoiceChannel(message).then(() => {
            addToQueue(getRandomFile(beepSoundFiles));
          });
        } else if (message.content === '!duke') {
          joinVoiceChannel(message).then(() => {
            addToQueue(dukeFile);
          });
        } else if (message.content === '!rim' || message.content === '!rimshot' || message.content === '!rimjob') {
          joinVoiceChannel(message).then(() => {
            addToQueue(rimshotFile);
          });
        } else if (message.content === '!lol' || message.content === 'lol' || message.content === 'lel' || message.content === 'lul') {
          joinVoiceChannel(message).then(() => {
            addToQueue(lolSoundFiles);
          });
        } else if (message.content === 'gotem') {
          joinVoiceChannel(message).then(() => {
            addToQueue(getRandomFile(gotemSoundFiles));
          });
        } else if (message.content === 'no' || message.content === 'noo' || message.content === 'nooo') {
          joinVoiceChannel(message).then(() => {
            addToQueue(path.join(__dirname, '../assets/sounds/static/nooo.mp3'));
          });
        } else if (message.content === '!city14') {
          joinVoiceChannel(message).then(() => {
            addToQueue(getRandomFile(city14SoundFiles));
          });
        } else if (message.content === '!dab') {
          joinVoiceChannel(message).then(() => {
            addToQueue(path.join(__dirname, '../assets/sounds/static/dab.wav'));
          });
        } else if (message.content === '!h3h3') {
          joinVoiceChannel(message).then(() => {
            addToQueue(getRandomFile(h3h3SoundFiles));
          });
        }
        
      }
    }
  }
  
  const soundProcessor = (options, soundObj) => {
    let observer = new Observer();
    options.messageRepo.subject.subscribeObserver(observer, "SoundBlaster");
    
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
        message.reply('Dude, you need to be in a voice channel to hear me!');
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
      let chance = Math.floor(Math.random()*10);
      if(chance === 9) {
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

  return Object.create({
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