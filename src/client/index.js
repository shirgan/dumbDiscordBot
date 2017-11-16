'use strict';
import fs from 'fs';
import path from 'path';

const clientController = (mediator, discordClient) => {

  const setClientSettings = (options) => {
    return new Promise((resolve, reject) => {   // lol
      discordClient.user.setUsername('Dumb Discord Bot');
      discordClient.user.setGame('your favorite memes since 2017');
    });
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