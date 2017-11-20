'use strict';
import fs from 'fs';
import path from 'path';
import util from 'util';

const generateImageFileList = (dir) => {
  return fs.readdirSync(dir)
  .map(file => {
      return path.join(dir, file);
  });
};

const messageController = (mediator, discordClient) => {
  
  let departureImagesPath = path.join(__dirname, '../assets/images');
  let departureImageFiles = generateImageFileList(departureImagesPath);
  
  let getRandomFile = (items) => {
    return items[Math.floor(Math.random()*items.length)];
  };

  
  const imageProcessor = (options) => {
    let observer = new Observer();
    options.messageRepo.subject.subscribeObserver(observer, "ImageBlaster");
    
  };

  const Observer = function() {
    return {
      notify: function(message) {
        if (message.content === '!img' || message.content === '!image') {
          message.channel.send("Is this what you wanted to see?", {
            files: [
              getRandomFile(departureImageFiles)
            ]
          });
        } else if (message.content === "!help") {
          message.channel.send({embed: {
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
        }
      }
    };
  }
  
  return Object.create({
    imageProcessor
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