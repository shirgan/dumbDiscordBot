'use strict';
import fs from 'fs';
import path from 'path';

const Subject = (mediator) => {
  let observers = [];

  return {
    subscribeObserver: function(observer, name) {
      observers.push(observer);
      mediator.emit('generic.log', "Observer registered "+name);
    },
    unsubscribeObserver: function(observer) {
      let index = observers.indexOf(observer);
      if(index > -1) {
        observers.splice(index, 1);
      }
    },
    notifyObserver: function(observer) {
      let index = observers.indexOf(observer);
      if(index > -1) {
        observers[index].notify(index);
      }
    },
    notifyAllObservers: function(message) {
      for(let i = 0; i < observers.length; i++){
        observers[i].notify(message);
      };
    }
  };
};

const messageController = (mediator, discordClient) => {
  
  var subject = new Subject(mediator);
  var wordDict = {};
  
  const messageRouter = (options) => {
    discordClient.on('message', message => {
      if(!message.author.bot){
        if (message.content === "!help") {
          message.reply({embed: {
              color: 3447003,
              title: "Project Wiki Help Page Thinger",
              url: "https://github.com/dot1q/dumbDiscordBot/wiki/DumbDiscordBot-Help-Page",
              description: "Attention users, please hold on! The saws are on the way!",
              fields: [{
                  name: "Sound Triggers",
                  value: "!rando\n!hoors\n!doot\n\!beep\n!duke\n!rimjob\ngotem\nno\n!city14\n!dab\r!h3h3"
                },
                {
                  name: "Image Triggers",
                  value: "!img"
                }
              ],
              timestamp: new Date(),
              footer: {
                //icon_url: discordClient.client.user.avatarURL,
                text: "© Deez nuts"
              }
            }
          });
        } else if (message.content === '!join' || message.content === '!listen') {
          //options.voiceRepo.joinChannel(message);
        } else if (message.content === '!leave' || message.content === '!go away') {
          options.voiceRepo.leaveChannel(message);
        } else {
          subject.notifyAllObservers(message);
        }
        
        // if word is not !topWords
        if(message.content !== '!topwords'){
          let messageArr = message.content.split(" ");
          
          for(let i=0; i<messageArr.length; i++){ 
            if(wordDict[messageArr[i]] !== undefined && wordDict[messageArr[i]] >= 0) {
              wordDict[messageArr[i]]++;
            } else {
              wordDict[messageArr[i]] = 1;
            }
          }
          
        } else {
          let messageStr = '';
          let sortable = [];
          let counter = 0;
          
          for (var i in wordDict) {
            sortable.push([i, wordDict[i]]);
          }
          
          sortable.sort(function(a, b) {
              return a[1] - b[1];
          });
          
          for(let i in sortable.reverse()) {
            messageStr += sortable[i][0]+": "+ sortable[i][1] + " times\r";
            
            if(counter <= 9 ) {
              counter++;
            } else {
              break;
            }
          }
          
          message.reply({embed: {
              color: 3447003,
              title: "Top Words!",
              url: "https://github.com/dot1q/dumbDiscordBot/wiki/DumbDiscordBot-Help-Page",
              description: "Here are the top 10 words:\r"+messageStr,
              timestamp: new Date(),
              footer: {
                text: "© Deez nuts"
              }
            }
          });

        }
      }
    });
  };
  


  return Object.create({
    messageRouter,
    subject
  });
};

const connect = (mediator, connection) => {
  return new Promise((resolve, reject) => {
    if(!connection) {
      reject(new Error('No discord object supplied!'));
    }
    resolve(messageController(mediator, connection));
  });
}

export {connect};