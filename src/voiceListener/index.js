'use strict';
import fs from 'fs';

const voiceListnerController = (mediator, discordClient) => {
  let globalOptions = null;
  let currentVoiceChannel = null;
  let currentVoiceConnection = null;
  let speakLog = {
    voiceChannels: {}
  };

  const startVoiceListenAgent = (options) => {
    globalOptions = options;  // not the right way to do this
  };
  
  const joinChannel = (message) => {
    globalOptions.global.stickyVoiceChannel = true;
    if (message.member.voiceChannel) {
      
      let voiceChannelId = message.member.voiceChannel.id;
      if(speakLog.voiceChannels[voiceChannelId] !== undefined) {
        // it exists!
      } else {
        speakLog.voiceChannels[voiceChannelId] = {users: {}};
      }
      
      if (message.member.voiceChannel !== currentVoiceChannel) {
        message.member.voiceChannel.join()
        .then(connection => { // Connection is an instance of VoiceConnection
          const voiceReceiver = connection.createReceiver();
          //discordMessageObj = message;
          currentVoiceChannel = message.member.voiceChannel;
          
          mediator.emit('generic.log', currentVoiceChannel.name);
          
          connection.on('speaking', (user, speaking) => {
            let startTime = 0;
            let endTime = 0;
            if(speaking) {
              startTime = (new Date).getTime();
              const audioStream = voiceReceiver.createPCMStream(user);
              // create an output stream so we can dump our data in a file
              //const outputStream = generateOutputFile(voiceChannel, user);
              // pipe our audio data into the file stream
              //audioStream.pipe(outputStream);
              //outputStream.on("data", console.log);
              audioStream.on('data', () => {
                return;
              });
              // when the stream ends (the user stopped talking) tell the user
              audioStream.on('end', (test) => {
                endTime = (new Date).getTime();
                let timeObj = {[startTime]: endTime-startTime};
                
                if (speakLog.voiceChannels[voiceChannelId].users[user.id] !== undefined) {
                  speakLog.voiceChannels[voiceChannelId].users[user.id].log.push(timeObj);
                } else {
                  speakLog.voiceChannels[voiceChannelId].users[user.id] = {log: [timeObj]};
                }
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
    globalOptions.global.stickyVoiceChannel = false;
    if (currentVoiceChannel != null) {
      currentVoiceChannel.leave();
      currentVoiceChannel = null;
    }
  };
  
  const speechReport = (message) => {
    if(!currentVoiceChannel){
      message.reply('I do not appear to be in any voice channel. pls help');
    } else {
      let messageStr = '';
      let sortable = [];
      let counter = 0;
      let reportPromise = new Promise((resolve, reject) => {
        for (var i in speakLog.voiceChannels[currentVoiceChannel.id].users) {
          console.log(speakLog.voiceChannels[currentVoiceChannel.id].users[i]);
          let clientName = discordClient.fetchUser(i);
          clientName.then( (userAccount) => {
            let tempIdx = i;
            let userLog = speakLog.voiceChannels[currentVoiceChannel.id].users[i].log;
            let time = 0;
            for (let j=0; j<userLog.length; j++) {
              for (var k in userLog[j]) {
               time += userLog[j][k];
              }
            }
            sortable.push([userAccount.username, time]);
            counter++;
            if(counter === Object.keys(speakLog.voiceChannels[currentVoiceChannel.id].users).length){
              counter = 0;
              resolve();
            }
            
          });
          //sortable.push({[i]: speakLog.voiceChannels[currentVoiceChannel.id].users[i]});
        }
      }).then( () => {
        sortable.sort(function(a, b) {
            return a[1] - b[1];
        });
        console.log(sortable);
        for(let i in sortable.reverse()) {
          //console.log(i);

          messageStr += sortable[i][0]+": "+ sortable[i][1]/1000/60 + " minutes\r";
          
          if(counter <= 9 ) {
            counter++;
          } else {
            break;
          }
        }
        
        message.reply({embed: {
            color: 3447003,
            title: "Top Words!",
            description: "Here are the top 10 talkers:\r"+messageStr,
            timestamp: new Date(),
            footer: {
              text: "© Deez nuts"
            }
          }
        });
        
      });
    }
  };

  return Object.create({
    startVoiceListenAgent,
    joinChannel,
    leaveChannel,
    speechReport,
    speakLog
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