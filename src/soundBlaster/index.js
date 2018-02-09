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
  
  // sounds
  let randoFilePath = path.join(__dirname, '../assets/sounds/rando');
  let hoorsFilePath = path.join(__dirname, '../assets/sounds/hoors');
  let dootFilePath = path.join(__dirname, '../assets/sounds/doot');
  let beepFilePath = path.join(__dirname, '../assets/sounds/beep');
  let lolFilePath = path.join(__dirname, '../assets/sounds/lol');
  let gotemPath = path.join(__dirname, '../assets/sounds/gotem/');
  let dukeFile = path.join(__dirname, '../assets/sounds/rando/NormalDuke.mp3');
  let rimshotFile = path.join(__dirname, '../assets/sounds/rimshot/rim.mp3');
  let city14Path = path.join(__dirname, '../assets/sounds/city14');
  let h3h3Path = path.join(__dirname, '../assets/sounds/h3h3');
  let alexJonesPath = path.join(__dirname, '../assets/sounds/aj');
  let billWurtz = path.join(__dirname, '../assets/sounds/bw');
  let lookAtThisDudePath = path.join(__dirname, '../assets/sounds/lotd');

  // images
  let departureImagesPath = path.join(__dirname, '../assets/images');
  let departureImageFiles = generateImageFileList(departureImagesPath);
  
  let soundFilesObj = {
    rando: {
      files: generateSoundFileList(randoFilePath),
      curIndex: 0
    },
    hoors: {
      files: generateSoundFileList(hoorsFilePath),
      curIndex: 0
    },
    doot: {
      files: generateSoundFileList(dootFilePath),
      curIndex: 0
    },
    beep: {
      files: generateSoundFileList(beepFilePath),
      curIndex: 0
    },
    lol: {
      files: generateSoundFileList(lolFilePath),
      curIndex: 0
    },
    gotem: {
      files: generateSoundFileList(gotemPath),
      curIndex: 0
    },
    city14: {
      files: generateSoundFileList(city14Path),
      curIndex: 0
    },
    h3h3: {
      files: generateSoundFileList(h3h3Path),
      curIndex: 0
    },
    alexJones: {
      files: generateSoundFileList(alexJonesPath),
      curIndex: 0
    },
    billWurtz: {
      files: generateSoundFileList(billWurtz),
      curIndex: 0
    },
    lookAtThisDude: {
      files: generateSoundFileList(lookAtThisDudePath),
      curIndex: 0
    }
  };
  
  for (var key in soundFilesObj) {
    soundFilesObj[key].files = shuffle(soundFilesObj[key].files);
  }
  
  const prepSoundFile = (obj) => {
    if(obj.curIndex === obj.files.length){
      obj.curIndex = 0;
      obj.files = shuffle(obj.files);
    }
    
    addToQueue(obj.files[obj.curIndex]);
    obj.curIndex++;
  };

  
  const Observer = function() {
    return {
      notify: function(message) {
        
        if (message.content === '!rando') {
          joinVoiceChannel(message).then(() => {
            prepSoundFile(soundFilesObj.rando);
          });
        } else if (message.content === '!hoors' || message.content === '!hoor') {
          joinVoiceChannel(message).then(() => {
            prepSoundFile(soundFilesObj.hoors);
          });
        } else if (message.content === '!doot') {
          joinVoiceChannel(message).then(() => {
            prepSoundFile(soundFilesObj.doot);
          });
        } else if (message.content === '!beep') {
          joinVoiceChannel(message).then(() => {
            prepSoundFile(soundFilesObj.beep);
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
            prepSoundFile(soundFilesObj.lol);
          });
        } else if (message.content === 'gotem') {
          joinVoiceChannel(message).then(() => {
            prepSoundFile(soundFilesObj.gotem);
          });
        } else if (message.content === 'no' || message.content === 'noo' || message.content === 'nooo') {
          joinVoiceChannel(message).then(() => {
            addToQueue(path.join(__dirname, '../assets/sounds/static/nooo.mp3'));
          });
        } else if (message.content === '!city14') {
          joinVoiceChannel(message).then(() => {
            prepSoundFile(soundFilesObj.city14);
          });
        } else if (message.content === '!dab') {
          joinVoiceChannel(message).then(() => {
            addToQueue(path.join(__dirname, '../assets/sounds/static/dab.wav'));
          });
        } else if (message.content === '!h3h3') {
          joinVoiceChannel(message).then(() => {
            prepSoundFile(soundFilesObj.h3h3);
          });
        } else if (message.content === '!aj') {
          joinVoiceChannel(message).then(() => {
            prepSoundFile(soundFilesObj.alexJones);
          });
        } else if (message.content === '!bill') {
          joinVoiceChannel(message).then(() => {
            prepSoundFile(soundFilesObj.billWurtz);
          });
        } else if (message.content === '!lookatthisdude' || message.content === '!lotd') {
          joinVoiceChannel(message).then(() => {
            prepSoundFile(soundFilesObj.lookAtThisDude);
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
        playNextSoundInQueue(options)
      });
    });
  }
  
  const joinVoiceChannel = (message) => {
    return new Promise((resolve, reject) => {
      if (message.member.voiceChannel) {
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
            discordMessageObj.channel.send("swag out", {
              files: [
                getRandomFile(departureImageFiles)
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

const connect = (mediator, connection) => {
  return new Promise((resolve, reject) => {
    if(!connection) {
      reject(new Error('No discord object supplied!'));
    }
    resolve(soundController(mediator, connection));
  });
}

export {connect};