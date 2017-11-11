'use strict';
import path from 'path';

const soundController = (mediator, discordClient) => {
  let discordMessageObj = null;
  let discordConnectionObj = null;
  let soundQueue = [];
  
  const soundTriggerListner = (options) => {
    
    //const {} = options;
    return new Promise((resolve, reject) => {
      discordClient.on('message', message => {
        // Add the voice triggers here
        if (message.content === '!test') {
          if (message.member.voiceChannel) {
            message.member.voiceChannel.join()
            .then(connection => { // Connection is an instance of VoiceConnection
              discordMessageObj = message;
              discordConnectionObj = connection;
              
              console.log(soundQueue.length);
              if(!soundQueue.length) {
                soundQueue.push({fileName: path.join(__dirname, '../assets/sounds/beans.wav')});
                mediator.emit('soundBlaster:newSound', 0);  // probably not efficent, but oh well
              } else {
                soundQueue.push({fileName: path.join(__dirname, '../assets/sounds/beans.wav')});
                
              }
              
              //console.log(connection);
              //const dispatcher = connection.playFile('./'+soundfile(dirs) );
              //const dispatcher = connection.playFile('./assets/sounds/tron-yeah.wav');
              //console.log(dispatcher);
              
            /*  dispatcher.on('end', () => {
                message.member.voiceChannel.leave();
              });*/
            })
            .catch(console.log);
            
            
          
          } else {
            message.reply('Dude, you need to be in a voice channel to here me!');
          }
        }
      });
    });
  };
  
  
  const soundProcessor = (options, soundObj) => {
    mediator.on('soundBlaster:newSound', (value) => {
      const dispatcher = discordConnectionObj.playFile(soundQueue[value].fileName);
      
      dispatcher.on('end', () => {
        playNextSoundInQueue()
        
      });
    });

  }
  
  const playNextSoundInQueue = () => {
    soundQueue.splice(0, 1);    // remove the first element and re-shuffle
    
    if (soundQueue.length != 0 ){
      mediator.emit('soundBlaster:newSound', 0);
    } else {
      discordMessageObj.member.voiceChannel.leave();
    }
  };
  
  return Object.create({
    soundTriggerListner,
    soundProcessor
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