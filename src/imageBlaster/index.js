'use strict';
import fs from 'fs';
import path from 'path';

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