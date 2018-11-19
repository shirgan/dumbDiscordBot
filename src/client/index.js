'use strict';

const clientController = (mediator, connectionsContainer, bootstrapContainer) => {
  const logger = bootstrapContainer.resolve('logger');
  const discordClient = connectionsContainer.resolve('discord');

  const setClientSettings = (options) => {
    discordClient.user.setActivity('your favorite memes since 2017');
  };

  return Object.create({
    setClientSettings
  });
};


const connect = (mediator, connectionsContainer, bootstrapContainer) => {
  return new Promise((resolve, reject) => {
    if(!connectionsContainer) {
      reject(new Error('No discord object supplied!'));
    }
    resolve(clientController(mediator, connectionsContainer, bootstrapContainer));
  });
};

export {connect};