'use strict';
const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');
const client = new Discord.Client();
const srcs_dup = [];
let dirs = null;

client.on('ready', () => {
  console.log('I am ready!');
  

  //Grabs a random index between 0 and length
  function randomIndex(length) {
    return Math.floor(Math.random() * (length));
  }

  let DIR = "./assets/sounds/";

  //Read the directory and get the files
  dirs = fs.readdirSync(DIR)
    .map(file => {
      return path.join(DIR, file);
    });


});


let soundfile = (items) => {
  return items[Math.floor(Math.random()*items.length)];
};

client.on('message', message => {
  // Voice only works in guilds, if the message does not come from a guild,
  // we ignore it
  if (!message.guild) return;

  if (message.content === '!test') {
    // Only try to join the sender's voice channel if they are in one themselves
    if (message.member.voiceChannel) {
      message.member.voiceChannel.join()
        .then(connection => { // Connection is an instance of VoiceConnection
          
          const dispatcher = connection.playFile('./'+soundfile(dirs) );
          
          dispatcher.on('end', () => {
            message.channel.send("swag out", {
              files: [
                "./assets/images/fellowKids.png"
              ]
            });
            message.member.voiceChannel.leave();
          });

          dispatcher.on('error', e => {
            // Catch any errors that may arise
            console.log(e);
          });
        })
        .catch(console.log);
    } else {
      message.reply('You need to join a voice channel first!');
    }
  }
});

client.login('Mzc3OTkxMzc0OTE1NzY0MjI0.DOU_ng.P17_uLPg99S0-QjYpr4jR8BkcFA');

