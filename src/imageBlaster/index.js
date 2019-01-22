'use strict';
import fs from 'fs';
import path from 'path';
import https from 'https';

const messageController = (mediator, connectionsContainer, bootstrapContainer, giphyOptions) => {
  const logger = bootstrapContainer.resolve('logger');
  const discordClient = connectionsContainer.resolve('discord');
  
  let departureImageFiles = [];

  let getRandomFile = (items) => {
    return items[Math.floor(Math.random()*items.length)];
  };

  
  const imageProcessor = (options) => {
    const plugins = options.pluginsRepo.getPlugins();
    for (let i = 0; i < plugins.length; i++) {
      departureImageFiles = departureImageFiles.concat(plugins[i].imagePool);
    }

    let observer = new Observer();
    options.messageRepo.subject.subscribeObserver(observer, 'ImageBlaster');
    
  };

  const Observer = function() {
    return {
      notify: function(message) {
        if (message.content === '!img' || message.content === '!image') {
          message.channel.send('Is this what you wanted to see?', {
            files: [
              getRandomFile(departureImageFiles)
            ]
          });
        } else if (message.content === '!giphy' || message.content === '!gif') {
          
          if(giphyOptions.apiKey) {
            let data = '';
            let options = {
              host: 'api.giphy.com',
              path: '/v1/gifs/random?api_key='+giphyOptions.apiKey,
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
              }
            };
            makeHttpRequest(options, data, (statusCode, result) => {
              console.log('making img call');
              if (statusCode != 200) {
                message.channel.send('😢 I couldn\'t complete the request. ' + statusCode);
              } else {
                if(result.data.image_url) {
                  message.channel.send('How\'d I do?', {
                    'embed': {
                      'image': {
                      'url': result.data.image_url,
                      }
                    }
                  });
                } else {
                  message.channel.send('😟 I found nothing.');
                }
              }
            });
          }
        } else if (message.content != null) {

        }
      }
    };
  };
  
  return Object.create({
    imageProcessor
  });
};

const connect = (mediator, connectionsContainer, bootstrapContainer) => {
  const giphyOptions = bootstrapContainer.resolve('giphySettings');
  return new Promise((resolve, reject) => {
    if(!connectionsContainer) {
      reject(new Error('No discord object supplied!'));
    }
    resolve(messageController(mediator, connectionsContainer, bootstrapContainer, giphyOptions));
  });
};

const makeHttpRequest = (options, payload, callback) => {
  options.port = 443;
  let request = https.request(options, (result) => {
    let output = '';
    result.setEncoding('utf8');
    
    // Listener to receive data
    result.on('data', (chunk) => {
        output += chunk;
    });

    // Listener for intializing callback after receiving complete response
    result.on('end', () => {
        let obj = JSON.parse(output);
        callback(result.statusCode, obj);
    });
  });
  
  request.on('error', (err) => {
    // put error handling here
  });
  
  request.write(payload);
  request.end();
};

export {connect};