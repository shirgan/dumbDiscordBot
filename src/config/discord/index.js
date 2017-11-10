import Discord from 'discord.js';

const connect = (options, mediator) => {
  mediator.once('boot.ready', () => {
    const client = new Discord.Client();    
    
    client.login(options.discordClientId).then( (successObj) => {
      mediator.emit('discord.ready', client);
    }, (rejectObj) => {
      mediator.emit('discord.error', rejectObj);
    });
  });
};

export {connect};