import Discord from 'discord.js';

const connect = (options, mediator) => {
  mediator.once('boot.ready', () => {
    const client = new Discord.Client();    
    
    if(options.discordClientId) {
      client.login(options.discordClientId).then( (successObj) => {
        mediator.emit('discord.ready', client);
      }, (rejectObj) => {
        mediator.emit('discord.error', rejectObj);
      });
    } else {
      mediator.emit('discord.error', 'Client ID not found!');
    }

  });
};

export {connect};