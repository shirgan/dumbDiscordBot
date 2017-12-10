'use strict';
import googleSpeech from '@google-cloud/speech';
import fs from 'fs';

const voiceListnerController = (mediator, discordClient) => {
  
  let currentVoiceChannel = null;
  let currentVoiceConnection = null;


  const startVoiceListenAgent = (options) => {

  };
  
  const joinChannel = (message) => {
    if (message.member.voiceChannel) {
      if (message.member.voiceChannel !== currentVoiceChannel) {
        message.member.voiceChannel.join()
        .then(connection => { // Connection is an instance of VoiceConnection
          const voiceReceiver = connection.createReceiver();
          //discordMessageObj = message;
          currentVoiceChannel = message.member.voiceChannel;
          
          mediator.emit('generic.log', 'Joined voice channel to listen: '+ currentVoiceChannel.name);
          
          connection.on('speaking', (user, speaking) => {
            if(speaking) {
              console.log("SPEAKING");
              const audioStream = voiceReceiver.createPCMStream(user);
              // create an output stream so we can dump our data in a file
              //const outputStream = generateOutputFile(voiceChannel, user);
              // pipe our audio data into the file stream
              //audioStream.pipe(outputStream);
              //outputStream.on("data", console.log);
              // when the stream ends (the user stopped talking) tell the user
              audioStream.on('end', () => {
                
              });
            }
          });
          
        });
      } else {

      }
      
    } else {
      message.reply('Dude, you need to be in a voice channel so I can join!');
    }
  };
  
  const leaveChannel = () => {
    if (currentVoiceChannel != null) {
      currentVoiceChannel.leave();
      currentVoiceChannel = null;
    }
  };

  return Object.create({
    startVoiceListenAgent,
    joinChannel,
    leaveChannel
  });
};

const connect = (mediator, connection) => {
  return new Promise((resolve, reject) => {
    if(!connection) {
      reject(new Error('No discord object supplied!'));
    }
    resolve(voiceListnerController(mediator, connection));
  });
}

export {connect};