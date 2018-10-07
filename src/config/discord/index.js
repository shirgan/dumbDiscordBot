import Discord from 'discord.js';
import { asValue } from 'awilix';

const connect = (mediator) => {
  mediator.once('boot.ready', ( bootstrapContainer, connectionsContainer ) => {
    const client = new Discord.Client();    
    
    if(bootstrapContainer.cradle.discordClientSettings.discordClientId) {
      client.login(bootstrapContainer.cradle.discordClientSettings.discordClientId).then( () => {
        connectionsContainer.register({discord: asValue(client)});
        mediator.emit('discord.ready', bootstrapContainer, connectionsContainer);
      }, (rejectObj) => {
        mediator.emit('discord.error', rejectObj);
      });
    } else {
      mediator.emit('discord.error', 'Client ID not found!');
    }

  });
};

export {connect};