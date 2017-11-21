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

const messageController = (mediator, discordClient, addlOptions) => {
  
  var subject = new Subject(mediator);
  
  const messageRouter = (options) => {
    discordClient.on('message', message => {
      
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
      } else if (message.content === '!giphy' || message.content === '!gif') {
        message.channel.send("How am I doing?", {
        });
      } else {
        subject.notifyAllObservers(message);
      }
    });
  };
  


  return Object.create({
    messageRouter,
    subject
  });
};

const connect = (mediator, connection, addlOptions) => {
  return new Promise((resolve, reject) => {
    if(!connection) {
      reject(new Error('No discord object supplied!'));
    }
    resolve(messageController(mediator, connection, addlOptions));
  });
}



export {connect};