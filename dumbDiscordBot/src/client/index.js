'use strict';
import fs from 'fs';
import path from 'path';

const clientController = (mediator, discordClient) => {

  // images
  let avatarImagesPath = path.join(__dirname, '../assets/avatars');

  const generateSoundFileList = (dir) => {
    return fs.readdirSync(dir)
    .map(file => {
      return path.join(dir, file);
    }); 
  };

  let departureImageFiles = generateSoundFileList(avatarImagesPath);
  
  const setClientSettings = (options) => {
    
    //const {} = options;
    return new Promise((resolve, reject) => {   // lol
      discordClient.user.setUsername('Dumb Discord Bot');
      discordClient.user.setGame('your favorite memes since 2017');
      // discordClient.user.setAvatar(getRandomFile(departureImageFiles));

    });
  };
  
  let getRandomFile = (items) => {
    return items[Math.floor(Math.random()*items.length)];
  };

  return Object.create({
    setClientSettings
  });
};


const connect = (mediator, connection) => {
  return new Promise((resolve, reject) => {
    if(!connection) {
      reject(new Error('No discord object supplied!'));
    }
    resolve(clientController(mediator, connection));
  });
}

export {connect};