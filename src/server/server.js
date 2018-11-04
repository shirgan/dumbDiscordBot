

import fetch from 'node-fetch';

const start = (options) => {
  return new Promise((resolve, reject) => {
    if (!options.soundRepo) { 
      reject(new Error('The server must have a connected soundRepo'));
    }
    
    if (!options.clientRepo) { 
      reject(new Error('The server must have a connected clientRepo'));
    }
    
    //options.locateRepo.getMailAndParse(options);
    options.global = {stickyVoiceChannel: false};
    options.messageRepo.getAllMessages(options);
    options.messageRepo.messageRouter(options);
    options.imageRepo.imageProcessor(options);
    options.soundRepo.soundProcessor(options);
    options.soundRepo.soundHalter();
    options.clientRepo.setClientSettings();
    options.voiceRepo.startVoiceListenAgent(options);
    
    /*if (!options.port) {
      reject(new Error('The server must be started with an available port'));
    } */

    let statusCode = 500;

    const request = (url) => {
      return new Promise((resolve, reject) => {
        fetch(url, { 
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'api-key': 'fc5c2d742ee9eccc38422a6b1a477e53'
          },
        }).then((result) => {
          statusCode = result.status;
          console.log(result.status);
          return result.json();
        }).then((success) => {
          if(statusCode >= 400) {
            reject(success);
          }
          resolve(success);
        }, (failed) => {
          console.log('errorsdfljasdflkskjak');
          console.log(failed);
        });
      });
    };

    request('https://services.campbells.com/api/Recipes//recipe/search')
      .then(success => {
        console.log('we good', success);
      }, failed => {
        console.log('boo boo', failed);
      });


    
    resolve();
    
    const server = resolve(server);
  });
};


export {start};