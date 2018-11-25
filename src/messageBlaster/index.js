'use strict';
import moment from 'moment';

const Subject = (mediator) => {
  let observers = [];

  return {
    subscribeObserver: function(observer, name) {
      observers.push(observer);
      mediator.emit('generic.log', 'Observer registered '+name);
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

const messageController = (mediator, connectionsContainer, bootstrapContainer) => {  
  const logger = bootstrapContainer.resolve('logger');
  const discordClient = connectionsContainer.resolve('discord');
  var subject = new Subject(mediator);
  var wordDict = {};

  const getAllMessages = (options) => {
    let channelPromises = new Array();

    let channels = discordClient.channels.array();
    for(let idx in channels) {
      const channel = channels[idx];
      if (channel.type === 'text') {
        channelPromises.push(
          new Promise((resolve, reject) => {
            let messageArr = new Array();
            let lastCount = 0;
            let lastId = channel.lastMessageID;
            let filterRequestCount = 100;

            
            if (channel.permissionsFor(discordClient.user).has('READ_MESSAGE_HISTORY')) {
              console.log(`Gathering messages from... ${channel.guild.name}:${channel.name}`);

              const getChannelMessages = () => {
                channel.fetchMessages({limit: filterRequestCount, before: lastId})
                  .then((newMessages) => {
                    // console.log(`got ${newMessages.size} new messages!`);
                    messageArr = messageArr.concat(newMessages.array());
                    lastCount = newMessages.size;
                    lastId = newMessages.array()[newMessages.size - 1].id;

                    if (lastCount === filterRequestCount) {
                      getChannelMessages();
                    } else {
                      // done
                      console.log('the deed is done');
                      let channelObj = {};
                      channelObj[channel.id] = messageArr;
                      resolve(channelObj);
                    }
                  }, (err) => {
                    reject(new Error(err));
                  });
              };

              getChannelMessages();
            }
          })
        );
      }
    }

    Promise.all(channelPromises).then((success) => {
      console.log('All messages pulled!');
      options.messageRepo.textChannelMessages = {};
      for (let i in success) {
        options.messageRepo.textChannelMessages = Object.assign(success[i], options.messageRepo.textChannelMessages);
      }
      options.messageRepo.quoteReady = true;
    }, (error) => {
      console.log('At least one TextChannel failed to pull all messages!');
      console.log(error);
    });
  };
  
  const messageRouter = (options) => {
    discordClient.on('message', message => {
      // this probably isn't the best way to go about this, but just convert everything to lower case
      message.content = message.content.toLowerCase();

      if(!message.author.bot){
        if (message.content === '!help') {
          message.reply({embed: {
              color: 3447003,
              title: 'Project Wiki Help Page Thinger',
              url: 'https://github.com/dot1q/dumbDiscordBot/wiki/DumbDiscordBot-Help-Page',
              description: 'Attention users, please hold on! The saws are on the way!',
              fields: [{
                  name: 'Sound Triggers',
                  value: '!rando\n!hoors\n!doot\n\!beep\n!duke\n!rimjob\ngotem\nno\n!city14\n!dab\r!h3h3'
                },
                {
                  name: 'Image Triggers',
                  value: '!img'
                }
              ],
              timestamp: new Date(),
              footer: {
                //icon_url: discordClient.client.user.avatarURL,
                text: '© Deez nuts'
              }
            }
          });
        } else if (message.content === '!join' || message.content === '!listen') {
          options.voiceRepo.joinChannel(message);
        } else if (message.content === '!leave' || message.content === '!go away') {
          mediator.emit('soundBlaster:halt');
          options.voiceRepo.leaveChannel(message);
        } else if (message.content === '!speechreport') {
          options.voiceRepo.speechReport(message);
        } else if (message.content.indexOf('!replay', 0) > 0) {
          options.voiceRepo.replay(message);
        } else if (message.content === '!quote') {
          if (options.messageRepo.quoteReady && options.messageRepo.textChannelMessages.hasOwnProperty(message.channel.id)) {
            const messageLength = options.messageRepo.textChannelMessages[message.channel.id].length;
            let completed = false;
            // give back that random message!
            do {
              let randomIdx = Math.floor((Math.random() * messageLength));
              const chatMessage = options.messageRepo.textChannelMessages[message.channel.id][randomIdx];
              if (!chatMessage.author.bot && chatMessage.content.length > 20) {
                completed = true;

                message.reply({embed: {
                  color: 3447003,
                  title: `Beep bep, old post from ${chatMessage.author.username}`,
                  description: `${chatMessage.content} @ ${moment(chatMessage.createdTimestamp).format('MM/DD/YYYY hh:mm a')}`,
                }});
              }
            } while (completed === false);
          } else if (options.messageRepo.quoteReady) {
            message.reply({embed: {
              color: 3447003,
              title: 'Quote machine broke!',
              description: 'I don\'t have this channel cached, restart bot pls',
            }});
          } else {
              message.reply(
                {embed: {
                  color: 3447003,
                  title: 'I need more time!',
                  description: 'I am still processing the old chat messages...',
                }
              });
          }
        } else {
          subject.notifyAllObservers(message);
        }
        
        // if word is not !topWords
        if(message.content !== '!topwords'){
          let messageArr = message.content.split(' ');
          
          for(let i=0; i<messageArr.length; i++){ 
            if(wordDict[messageArr[i]] !== undefined && wordDict[messageArr[i]] >= 0) {
              wordDict[messageArr[i]]++;
            } else {
              wordDict[messageArr[i]] = 1;
            }
          }
          
        } else {
          let messageStr = '';
          let sortable = [];
          let counter = 0;
          
          for (var i in wordDict) {
            sortable.push([i, wordDict[i]]);
          }
          
          sortable.sort(function(a, b) {
              return a[1] - b[1];
          });
          
          for(let i in sortable.reverse()) {
            messageStr += sortable[i][0]+': '+ sortable[i][1] + ' times\r';
            
            if(counter <= 9 ) {
              counter++;
            } else {
              break;
            }
          }
          
          message.reply({embed: {
              color: 3447003,
              title: 'Top Words!',
              description: 'Here are the top 10 words:\r'+messageStr,
              timestamp: new Date(),
              footer: {
                text: '© Deez nuts'
              }
            }
          });

        }
      }
    });
  };
  


  return Object.create({
    messageRouter,
    getAllMessages,
    subject,
    quoteReady: false,
    textChannelMessages: {},
  });
};

const connect = (mediator, connectionsContainer, bootstrapContainer) => {
  return new Promise((resolve, reject) => {
    if(!connectionsContainer) {
      reject(new Error('No discord object supplied!'));
    }
    resolve(messageController(mediator, connectionsContainer, bootstrapContainer));
  });
};

export {connect};
