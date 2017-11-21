

const start = (options) => {
  return new Promise((resolve, reject) => {
    if (!options.soundRepo) { 
      reject(new Error('The server must have a connected soundRepo'));
    }
    
    if (!options.clientRepo) { 
      reject(new Error('The server must have a connected clientRepo'));
    }
    
    //options.locateRepo.getMailAndParse(options);
    options.messageRepo.messageRouter(options);
    options.imageRepo.imageProcessor(options);
    options.soundRepo.soundProcessor(options);
    options.soundRepo.soundHalter();
    options.clientRepo.setClientSettings();
    
    /*if (!options.port) {
      reject(new Error('The server must be started with an available port'));
    } */
    
    resolve("TEST");
    
    const server = resolve(server);
  });
}


export {start};