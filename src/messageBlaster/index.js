'use strict';
import moment from 'moment';
import fetch from 'node-fetch';

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
  const subject = new Subject(mediator);

  let lastMemeType = "";
  let lastMemeTopText = "";
  let lastMemeBottomText = "";

  const getAllMessages = (options) => {
    let channelPromises = new Array();

    let channels = discordClient.channels.array();
    for(let idx in channels) {
      const channel = channels[idx];
      if (channel.type === 'text' && channel.permissionsFor(discordClient.user).has('READ_MESSAGE_HISTORY')) {
        channelPromises.push(
          new Promise((resolve, reject) => {
            let messageArr = new Array();
            let lastCount = 0;
            let lastId = channel.lastMessageID;
            let filterRequestCount = 100;

            console.log(`Gathering messages from... ${channel.guild.name}:${channel.name}`);

            const getChannelMessages = () => {
              channel.fetchMessages({limit: filterRequestCount, before: lastId})
                .then((newMessages) => {
                  // console.log(`got ${newMessages.size} new messages!`);
                  messageArr = messageArr.concat(newMessages.array());
                  lastCount = newMessages.size;
                  if (newMessages.size > 0) {
                    lastId = newMessages.array()[newMessages.size - 1].id;

                    if (lastCount === filterRequestCount) {
                      getChannelMessages();
                    } else {
                      // done
                      resolve(messageArr);
                    }
                  } else {
                    resolve(messageArr);
                  }
                }, (err) => {
                  console.log('something went wrong..');
                  reject(new Error(err));
                });
            };

            getChannelMessages();
          })
        );
      }
    }

    Promise.all(channelPromises).then((success) => {
      console.log('All messages pulled!');
      for (let i in success) {
        options.messageRepo.textChannelMessages = options.messageRepo.textChannelMessages.concat(success[i]);
      }
      options.messageRepo.quoteReady = true;
    }, (error) => {
      console.log('At least one TextChannel failed to pull all messages!');
      console.log(error);
    });
  };
  
  const messageRouter = (options) => {
    discordClient.on('message', message => {
      const textPrefix = '!';

      if(message.content.indexOf(textPrefix) !== 0) return;

      const args = message.content.slice(textPrefix.length).trim().split(/ +/g);
      const command = args.shift().toLowerCase();

      if(!message.author.bot){
        if (command === 'help') {
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
        } else if (command === 'quote') {
          const resp = getQuote(options.messageRepo, message);
          if(resp.result === 'success') {
            message.reply({embed: {
              color: 3447003,
              title: `Beep bep, old post from ${resp.messageObj.author.username}`,
              description: `${resp.messageObj.content} @ ${moment(resp.messageObj.createdTimestamp).format('MM/DD/YYYY hh:mm a')} - Sauce: ${resp.messageObj.url}`,
            }});
          } else {
            message.reply(resp.message);
          }
        } else if (command === 'plugins') {
          const pluginList = options.pluginsRepo.getPluginList();
          message.reply(
            {embed: {
              color: 3447003,
              title: 'Current Plugins',
              description: pluginList.map(x => `${x.name}@${x.version} by ${x.author}`).join('\n'),
            }
          });
        } else if (command === 'meme') {
          let topText = 'Top Text';
          let bottomText = 'Bottom Text';

          // Force reset the last text to top and bottom to prevent no entries in rememe
          lastMemeTopText = topText;
          lastMemeBottomText = bottomText;

          let memeTextResponse = null;

          // Get top text
          memeTextResponse = generateMemeText(options.messageRepo);
          if (memeTextResponse.result === 'success') {
            topText = memeTextResponse.memeText;
            lastMemeTopText = topText;
          }

          // Get bottom text
          memeTextResponse = generateMemeText(options.messageRepo);
          if (memeTextResponse.result === 'success') {
            bottomText = memeTextResponse.memeText;
            lastMemeBottomText = bottomText;
          }

          // Get all possible meme formats
          getMemeImageList().then((success) => {
            const memeType = success[Math.floor((Math.random() * success.length))];

            if(args.length > 0) {
              for (let i = 0; i < success.length; i++) {
                for(let j = 0; j < args.length; j++) {
                  if (success[i].toLowerCase().search(args[j].toLowerCase()) > -1) {
                    memeType = success[i];
                  }
                }
              }
            }

            lastMemeType = memeType;

            postMemeMessage(message, memeType, topText, bottomText);
            
          }, (failed) => {

          });

        } else if (command === 'rememe') {
          if(lastMemeType === "") {
            message.reply("Whoops! You need to !meme before you can !rememe IDIOT.");
            return;
          }

          let topText = 'Top Text';
          let bottomText = 'Bottom Text';
          let memeTextResponse = null;

          // Get top text, specifying top as part of the rememe via args will regenerate the top text
          if(args.indexOf("top") > -1) {
            memeTextResponse = generateMemeText(options.messageRepo);
            if (memeTextResponse.result === 'success') {
              topText = memeTextResponse.memeText;
              lastMemeTopText = topText;
            }
          } else {
            topText = lastMemeTopText;
          }

          // Get bottom text, specifying bottom as part of the rememe via args will regenerate the bottom text
          if(args.indexOf("bottom") > -1) {
            memeTextResponse = generateMemeText(options.messageRepo);
            if (memeTextResponse.result === 'success') {
              bottomText = memeTextResponse.memeText;
              lastMemeBottomText = bottomText;
            }
          } else {
            bottomText = lastMemeBottomText;
          }

          // Flip the top and bottom text
          if(args.indexOf("flip") > -1) {
            bottomText = lastMemeTopText;
            topText = lastMemeBottomText;

            lastMemeTopText = topText;
            lastMemeBottomText = bottomText;
          }

          if(args.indexOf("img") > -1) {
            // Get all possible meme formats
            getMemeImageList().then((success) => {
              const memeType = success[Math.floor((Math.random() * success.length))];
              lastMemeType = memeType;

              postMemeMessage(message, memeType, topText, bottomText);          
            }, (failed) => {

            });
          } else {
            // Use the same meme format but whatever text we generated
            postMemeMessage(message, lastMemeType, topText, bottomText);
          }
          
        } else {
          subject.notifyAllObservers(message);
        }
      }
    });

    const getResolveUsernames = (messageObj) => {
      const message = messageObj.content;
      const adjustment = message.replace(/<@.*?>/g, ($) => {
        let trim = $.replace(/[<@!>]/g, '');
        const asdf = messageObj.mentions.users.get(trim);
        // console.log(message);
        return asdf.username;
      });
      // console.log(adjustment);
      return adjustment;
    };

    const formatQuote = (quote) => {
      const MAX_LINE_LENGTH = 40;
      let lines = [];
      let currentLine = '';
      const words = quote.split(' ').reverse();
      do {
        const idx = words.length-1;
        if (words[idx].length > MAX_LINE_LENGTH) {
          lines.push(words[idx].substring(0, MAX_LINE_LENGTH));
          words[idx] = words[idx].substring(MAX_LINE_LENGTH);
        } else if (words[idx].length === MAX_LINE_LENGTH) {
          lines.push(words[idx].substring(0, MAX_LINE_LENGTH));
          words.pop();
        } else {
          if (currentLine.length + words[idx].length <= 40) {
            currentLine+=words[idx]+' ';
            words.pop();
          }else {
            lines.push(currentLine.trim());
            currentLine = '';
          }
        }
        //console.log(words.length);
      } while(words.length > 0);
      lines.push(currentLine.trim());
      return lines.join('\n');
    };

    const getQuote = (messageRepo) => {
      if (messageRepo.quoteReady) {
        const messageLength = messageRepo.textChannelMessages.length;
        let completed = false;
        // give back that random message!
        do {
          let randomIdx = Math.floor((Math.random() * messageLength));
          const chatMessage = messageRepo.textChannelMessages[randomIdx];
          if (!chatMessage.author.bot && chatMessage.content.length > 20) {
            completed = true;

            return {
              result: 'success',
              messageObj: chatMessage,
            };
          }
        } while (completed === false);
      } else if (messageRepo.quoteReady) {
        return {
          result: 'failed',
          message: 'I don\'t have this channel cached, restart bot pls',
        };
      } else {
        return {
          result: 'failed',
          message: 'I am still processing the old chat messages...',
        };
      }
    };

    const generateMemeText = (messageRepo) => {
      let outText = "GENERATED MEME TEXT";
      let resp = null;

      do {
        resp = getQuote(messageRepo);
        if (resp.result === 'success') {
          if (resp.messageObj.embeds.length === 0 ) {
            outText = formatQuote(getResolveUsernames(resp.messageObj));
          }
        } else {
          return {
            result: 'failed',
            memeText: "INVALID",
          };
          break;
        }
      } while ( resp.messageObj.embeds.length !== 0 || resp.messageObj.content.indexOf('://') > -1 );

      return {
        result: 'success',
        memeText: outText,
      };
    }
  };
  
  const postMemeMessage = (message, memeType, topText, bottomText) => {
    message.reply(
      {embed: {
        color: 3447003,
        title: 'I got a meme for you',
        image: {
          url: `http://apimeme.com/meme?meme=${encodeURIComponent(memeType)}&top=${encodeURIComponent(topText)}&bottom=${encodeURIComponent(bottomText)}`
        }
      }
    });
  }

  return Object.create({
    messageRouter,
    getAllMessages,
    subject,
    quoteReady: false,
    textChannelMessages: [],
  });
};

const getMemeImageList = () => {
  return new Promise((resolve, reject) => {
    fetch('http://apimeme.com/images', {
      method: 'get',
      headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.json())
    .then(json => resolve(json));
  });
  reject();
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
